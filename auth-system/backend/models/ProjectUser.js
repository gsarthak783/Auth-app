const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const projectUserSchema = new mongoose.Schema({
  // Basic Information
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    trim: true,
    sparse: true
  },
  password: {
    type: String,
    required: function() {
      return !this.providers || this.providers.length === 0;
    }
  },

  // Personal Information
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  displayName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Contact Information
  phoneNumber: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },

  // Project Association - CRITICAL: This links the user to a specific project
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },

  // Account Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },

  // Security
  emailVerificationToken: {
    type: String,
    sparse: true
  },
  emailVerificationExpires: {
    type: Date
  },
  passwordResetToken: {
    type: String,
    sparse: true
  },
  passwordResetExpires: {
    type: Date
  },
  twoFactorSecret: {
    type: String
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },

  // Login Security
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  failedLoginIPs: [{
    ip: String,
    attempts: Number,
    lastAttempt: Date
  }],

  // OAuth Providers
  providers: [{
    provider: {
      type: String,
      enum: ['google', 'facebook', 'github', 'twitter', 'apple']
    },
    providerId: String,
    providerData: mongoose.Schema.Types.Mixed
  }],

  // Custom Fields (configurable per project)
  customFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // User Preferences
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      profileVisibility: {
        type: String,
        enum: ['public', 'private', 'friends'],
        default: 'public'
      },
      showEmail: {
        type: Boolean,
        default: false
      },
      showPhone: {
        type: Boolean,
        default: false
      }
    }
  },

  // Session Management
  sessions: [{
    token: String,
    device: String,
    ip: String,
    userAgent: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  }],

  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  deletedAt: {
    type: Date
  },

  // Analytics tracking
  signupSource: {
    type: String,
    trim: true
  },
  signupIP: {
    type: String,
    trim: true
  },
  signupUserAgent: {
    type: String,
    trim: true
  },
  lastActiveAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'projectUsers'
});

// Compound indexes for performance
projectUserSchema.index({ projectId: 1, email: 1 }, { unique: true });
projectUserSchema.index({ projectId: 1, username: 1 }, { unique: true, sparse: true });
projectUserSchema.index({ projectId: 1, isActive: 1 });
projectUserSchema.index({ projectId: 1, createdAt: -1 });
projectUserSchema.index({ lastActiveAt: -1 });

// Virtual for account lock status
projectUserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save hash password
projectUserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save update timestamp
projectUserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
projectUserSchema.methods.comparePassword = async function(password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};

projectUserSchema.methods.incrementLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  
  // If we're at max attempts and haven't been locked yet, lock account
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};

projectUserSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

// Static methods
projectUserSchema.statics.findByEmail = function(projectId, email) {
  return this.findOne({ projectId, email: email.toLowerCase(), deletedAt: null });
};

projectUserSchema.statics.findByUsername = function(projectId, username) {
  return this.findOne({ projectId, username, deletedAt: null });
};

projectUserSchema.statics.findActiveUsers = function(projectId, options = {}) {
  const query = { 
    projectId, 
    isActive: true, 
    deletedAt: null 
  };
  
  return this.find(query)
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 100)
    .skip(options.skip || 0);
};

projectUserSchema.statics.getProjectStats = function(projectId) {
  return this.aggregate([
    { $match: { projectId: new mongoose.Types.ObjectId(projectId), deletedAt: null } },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        verifiedUsers: { $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] } },
        suspendedUsers: { $sum: { $cond: [{ $eq: ['$isSuspended', true] }, 1, 0] } },
        usersToday: {
          $sum: {
            $cond: [
              { $gte: ['$createdAt', new Date(new Date().setHours(0, 0, 0, 0))] },
              1,
              0
            ]
          }
        },
        usersThisWeek: {
          $sum: {
            $cond: [
              { $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

const ProjectUser = mongoose.model('ProjectUser', projectUserSchema);

module.exports = ProjectUser;