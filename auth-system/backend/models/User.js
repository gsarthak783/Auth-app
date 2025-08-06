import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  // Basic Information - Required for platform users
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  displayName: {
    type: String,
    trim: true,
    maxlength: 100
  },

  // Profile Information
  avatar: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  website: {
    type: String,
    trim: true
  },

  // Contact Information
  phoneNumber: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // Security & Authentication
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
  lastLogin: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    default: 0,
    max: 10
  },
  lockUntil: {
    type: Date
  },
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    success: Boolean
  }],

  // Session Management
  refreshTokens: [{
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

  // Platform Preferences
  preferences: {
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    marketingEmails: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    }
  },

  // Subscription & Billing (for future use)
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'past_due'],
      default: 'active'
    },
    customerId: String, // Stripe customer ID
    subscriptionId: String, // Stripe subscription ID
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    trialEndsAt: Date
  },

  // Usage Limits (based on subscription)
  limits: {
    maxProjects: {
      type: Number,
      default: 5 // Updated limit
    },
    maxUsersPerProject: {
      type: Number,
      default: 10000 // Increased limit
    },
    maxAPICallsPerMonth: {
      type: Number,
      default: 100000 // Increased limit
    }
  },

  // Usage Statistics
  stats: {
    totalProjects: {
      type: Number,
      default: 0
    },
    totalAPICallsThisMonth: {
      type: Number,
      default: 0
    },
    lastAPICallsReset: {
      type: Date,
      default: Date.now
    }
  },

  // Project Access (for tracking user's projects and roles)
  projectAccess: [{
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    },
    permissions: [{
      type: String
    }],
    joinedAt: {
      type: Date,
      default: Date.now
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

  // Analytics
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
  collection: 'users'
});

// Indexes for performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastActiveAt: -1 });
userSchema.index({ 'subscription.plan': 1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName || ''}`.trim();
});

// Pre-save hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
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
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.incrementLoginAttempts = function() {
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

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

userSchema.methods.canCreateProject = function() {
  return this.stats.totalProjects < this.limits.maxProjects;
};

userSchema.methods.incrementProjectCount = function() {
  return this.updateOne({
    $inc: { 'stats.totalProjects': 1 }
  });
};

userSchema.methods.decrementProjectCount = function() {
  return this.updateOne({
    $inc: { 'stats.totalProjects': -1 }
  });
};

userSchema.methods.incrementAPICallCount = function() {
  // Reset counter if it's a new month
  const now = new Date();
  const lastReset = this.stats.lastAPICallsReset;
  const isNewMonth = now.getMonth() !== lastReset.getMonth() || 
                     now.getFullYear() !== lastReset.getFullYear();
  
  if (isNewMonth) {
    return this.updateOne({
      $set: {
        'stats.totalAPICallsThisMonth': 1,
        'stats.lastAPICallsReset': now
      }
    });
  }
  
  return this.updateOne({
    $inc: { 'stats.totalAPICallsThisMonth': 1 }
  });
};

userSchema.methods.hasAPICallsLeft = function() {
  return this.stats.totalAPICallsThisMonth < this.limits.maxAPICallsPerMonth;
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase(), deletedAt: null });
};

userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username, deletedAt: null });
};

userSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true, deletedAt: null });
};

const User = mongoose.model('User', userSchema);

export default User;