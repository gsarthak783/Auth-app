import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Project Configuration
  apiKey: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  apiSecret: {
    type: String,
    required: true,
    select: false // Don't include in queries by default
  },
  
  // Domain Configuration
  allowedDomains: [{
    type: String,
    trim: true
  }],
  allowedOrigins: [{
    type: String,
    trim: true
  }],
  
  // Authentication Settings
  settings: {
    // Sign up settings
    allowSignup: {
      type: Boolean,
      default: true
    },
    requireEmailVerification: {
      type: Boolean,
      default: true
    },
    
    // Password settings
    minPasswordLength: {
      type: Number,
      default: 6,
      min: 4,
      max: 128
    },
    requireUppercase: {
      type: Boolean,
      default: false
    },
    requireLowercase: {
      type: Boolean,
      default: false
    },
    requireNumbers: {
      type: Boolean,
      default: false
    },
    requireSpecialChars: {
      type: Boolean,
      default: false
    },
    
    // Session settings
    sessionTimeout: {
      type: Number,
      default: 15, // minutes
      min: 5,
      max: 1440
    },
    maxSessions: {
      type: Number,
      default: 5,
      min: 1,
      max: 20
    },
    
    // Security settings
    enableTwoFactor: {
      type: Boolean,
      default: false
    },
    enableAccountLocking: {
      type: Boolean,
      default: true
    },
    maxLoginAttempts: {
      type: Number,
      default: 5,
      min: 3,
      max: 10
    },
    lockoutDuration: {
      type: Number,
      default: 120, // minutes
      min: 5,
      max: 1440
    },
    
    // OAuth providers
    oauthProviders: {
      google: {
        enabled: {
          type: Boolean,
          default: false
        },
        clientId: String,
        clientSecret: String
      },
      github: {
        enabled: {
          type: Boolean,
          default: false
        },
        clientId: String,
        clientSecret: String
      },
      facebook: {
        enabled: {
          type: Boolean,
          default: false
        },
        clientId: String,
        clientSecret: String
      }
    }
  },
  
  // Email Templates
  emailTemplates: {
    welcome: {
      subject: {
        type: String,
        default: 'Welcome to {{projectName}}'
      },
      body: {
        type: String,
        default: 'Welcome to our platform! Please verify your email.'
      }
    },
    verification: {
      subject: {
        type: String,
        default: 'Verify your email address'
      },
      body: {
        type: String,
        default: 'Click the link to verify your email: {{verificationLink}}'
      }
    },
    passwordReset: {
      subject: {
        type: String,
        default: 'Reset your password'
      },
      body: {
        type: String,
        default: 'Click the link to reset your password: {{resetLink}}'
      }
    }
  },
  
  // Statistics
  stats: {
    totalUsers: {
      type: Number,
      default: 0
    },
    activeUsers: {
      type: Number,
      default: 0
    },
    verifiedUsers: {
      type: Number,
      default: 0
    },
    totalLogins: {
      type: Number,
      default: 0
    },
    lastLogin: Date
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspendedUntil: Date,
  suspensionReason: String,
  
  // Ownership
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
projectSchema.index({ apiKey: 1 });
projectSchema.index({ owner: 1 });
projectSchema.index({ 'team.user': 1 });
projectSchema.index({ createdAt: -1 });
projectSchema.index({ isActive: 1 });

// Virtual for active team members count
projectSchema.virtual('teamCount').get(function() {
  return this.team ? this.team.length : 0;
});

// Static method to find by API key
projectSchema.statics.findByApiKey = function(apiKey) {
  return this.findOne({
    apiKey,
    isActive: true,
    deletedAt: { $exists: false }
  });
};

// Static method to find user's projects
projectSchema.statics.findUserProjects = function(userId) {
  return this.find({
    $or: [
      { owner: userId },
      { 'team.user': userId }
    ],
    isActive: true,
    deletedAt: { $exists: false }
  }).populate('owner', 'username email displayName')
    .populate('team.user', 'username email displayName');
};

// Instance method to check if user has access
projectSchema.methods.hasAccess = function(userId, requiredRole = 'member') {
  const roleHierarchy = { member: 1, admin: 2, owner: 3 };
  const requiredLevel = roleHierarchy[requiredRole] || 1;
  
  // Check if user is owner (handle both populated and non-populated owner)
  const ownerId = this.owner?._id || this.owner;
  if (ownerId && ownerId.toString() === userId.toString()) {
    return roleHierarchy.owner >= requiredLevel;
  }
  
  // Check team membership (handle both populated and non-populated team users)
  const teamMember = this.team.find(member => {
    const memberId = member.user?._id || member.user;
    return memberId && memberId.toString() === userId.toString();
  });
  
  if (teamMember) {
    const userLevel = roleHierarchy[teamMember.role] || 1;
    return userLevel >= requiredLevel;
  }
  
  return false;
};

// Instance method to add team member
projectSchema.methods.addTeamMember = function(userId, role = 'member', permissions = []) {
  // Check if user is already a team member
  const existingMember = this.team.find(member => 
    member.user.toString() === userId.toString()
  );
  
  if (existingMember) {
    // Update existing member
    existingMember.role = role;
    existingMember.permissions = permissions;
    return this.save();
  } else {
    // Add new member
    this.team.push({
      user: userId,
      role,
      permissions,
      joinedAt: new Date()
    });
    return this.save();
  }
};

// Instance method to remove team member
projectSchema.methods.removeTeamMember = function(userId) {
  this.team = this.team.filter(member => 
    member.user.toString() !== userId.toString()
  );
  return this.save();
};

export default mongoose.model('Project', projectSchema);