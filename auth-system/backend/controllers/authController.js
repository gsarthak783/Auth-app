import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Project from '../models/Project.js';
import {
  generateTokenPair,
  generateVerificationToken,
  generatePasswordResetToken,
  getTokenExpiration,
  hashToken,
  verifyRefreshToken
} from '../utils/jwt.js';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendSecurityAlertEmail
} from '../utils/email.js';

// Validation rules
export const validateSignup = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('username').isLength({ min: 3, max: 30 }).matches(/^[a-zA-Z0-9_]+$/).withMessage('Username must be 3-30 characters, letters, numbers, and underscores only'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').optional().isLength({ max: 50 }).trim(),
  body('lastName').optional().isLength({ max: 50 }).trim()
];

export const validateLogin = [
  body('login').notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const validatePasswordReset = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
];

export const validatePasswordChange = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// User signup
export const signup = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email, username, password, firstName, lastName, phoneNumber } = req.body;
    const project = req.project;

    // Check if signup is allowed for this project
    if (project && !project.settings.allowSignup) {
      return res.status(403).json({
        success: false,
        message: 'Signup is disabled for this project'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      deletedAt: { $exists: false }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create new user
    const user = new User({
      email,
      username,
      password,
      firstName,
      lastName,
      phoneNumber,
      isVerified: project ? !project.settings.requireEmailVerification : false
    });

    // Add user to project if project context exists
    if (project) {
      user.projectAccess.push({
        projectId: project._id,
        role: 'member',
        joinedAt: new Date()
      });
    }

    await user.save();

    // Generate verification token if needed
    if (project && project.settings.requireEmailVerification) {
      const verificationToken = generateVerificationToken();
      const hashedToken = hashToken(verificationToken);
      
      user.emailVerificationToken = hashedToken;
      user.emailVerificationExpires = getTokenExpiration('verification');
      await user.save();

      // Send verification email
      try {
        await sendVerificationEmail(user, verificationToken, project.name);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
      }
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    const tokens = generateTokenPair(tokenPayload);

    // Store refresh token
    const refreshTokenData = {
      token: tokens.refreshToken,
      expiresAt: getTokenExpiration('refresh'),
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }
    };

    user.refreshTokens.push(refreshTokenData);
    await user.save();

    // Update project stats
    if (project) {
      project.stats.totalUsers += 1;
      if (user.isVerified) {
        project.stats.verifiedUsers += 1;
      }
      await project.save();
    }

    // Send welcome email if verified
    if (user.isVerified) {
      try {
        await sendWelcomeEmail(user, project ? project.name : 'Auth System');
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: user.isVerified ? 'Account created successfully' : 'Account created. Please check your email for verification.',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
        role: user.role,
        createdAt: user.createdAt
      },
      tokens: user.isVerified ? tokens : undefined,
      needsVerification: !user.isVerified
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// User login
export const login = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { login, password } = req.body;
    const project = req.project;

    // Find user by email or username
    const user = await User.findByLogin(login).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is locked due to multiple failed login attempts',
        lockUntil: user.lockUntil
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Check if user has access to project
    if (project) {
      const hasAccess = user.projectAccess.some(
        access => access.projectId.toString() === project._id.toString()
      );

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'No access to this project'
        });
      }
    }

    // Update login info
    user.lastLogin = new Date();
    user.lastLoginIP = req.ip;

    // Generate tokens
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      projectId: project ? project._id : undefined
    };

    const tokens = generateTokenPair(tokenPayload);

    // Store refresh token
    const refreshTokenData = {
      token: tokens.refreshToken,
      expiresAt: getTokenExpiration('refresh'),
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }
    };

    user.refreshTokens.push(refreshTokenData);

    // Limit stored refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save();

    // Update project stats
    if (project) {
      project.stats.totalLogins += 1;
      project.stats.lastLogin = new Date();
      await project.save();
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatar: user.avatar,
        isVerified: user.isVerified,
        role: user.role,
        lastLogin: user.lastLogin
      },
      tokens
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenIndex = user.refreshTokens.findIndex(
      tokenData => tokenData.token === refreshToken && tokenData.expiresAt > new Date()
    );

    if (tokenIndex === -1) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      username: user.username,
      role: user.role
    };

    const tokens = generateTokenPair(tokenPayload);

    // Update refresh token
    user.refreshTokens[tokenIndex] = {
      token: tokens.refreshToken,
      expiresAt: getTokenExpiration('refresh'),
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }
    };

    await user.save();

    res.json({
      success: true,
      tokens
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;

    if (refreshToken && user) {
      // Remove specific refresh token
      user.refreshTokens = user.refreshTokens.filter(
        tokenData => tokenData.token !== refreshToken
      );
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout all devices
export const logoutAll = async (req, res) => {
  try {
    const user = req.user;

    // Clear all refresh tokens
    user.refreshTokens = [];
    await user.save();

    res.json({
      success: true,
      message: 'Logged out from all devices'
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: 'Token and email are required'
      });
    }

    const hashedToken = hashToken(token);

    // Find user with matching verification token
    const user = await User.findOne({
      email,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
      deletedAt: { $exists: false }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Update project stats
    const projectAccess = user.projectAccess[0];
    if (projectAccess) {
      const project = await Project.findById(projectAccess.projectId);
      if (project) {
        project.stats.verifiedUsers += 1;
        await project.save();
      }
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const project = req.project;

    // Find user
    const user = await User.findOne({
      email,
      deletedAt: { $exists: false }
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken();
    const hashedToken = hashToken(resetToken);

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = getTokenExpiration('reset');
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user, resetToken, project ? project.name : 'Auth System');
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { token, email, password } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: 'Token and email are required'
      });
    }

    const hashedToken = hashToken(token);

    // Find user with matching reset token
    const user = await User.findOne({
      email,
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
      deletedAt: { $exists: false }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // Clear all refresh tokens for security
    user.refreshTokens = [];
    
    await user.save();

    // Send security alert
    try {
      await sendSecurityAlertEmail(
        user,
        'Password Reset',
        'Your password has been successfully reset'
      );
    } catch (emailError) {
      console.error('Failed to send security alert:', emailError);
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Change password (authenticated)
export const changePassword = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    
    // Keep current session but clear other refresh tokens
    const currentRefreshToken = req.body.refreshToken;
    if (currentRefreshToken) {
      user.refreshTokens = user.refreshTokens.filter(
        tokenData => tokenData.token === currentRefreshToken
      );
    } else {
      user.refreshTokens = [];
    }
    
    await user.save();

    // Send security alert
    try {
      await sendSecurityAlertEmail(
        user,
        'Password Changed',
        'Your password has been successfully changed'
      );
    } catch (emailError) {
      console.error('Failed to send security alert:', emailError);
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        isVerified: user.isVerified,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      displayName,
      phoneNumber,
      bio,
      dateOfBirth,
      gender,
      preferences
    } = req.body;

    const user = await User.findById(req.user._id);

    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (displayName !== undefined) user.displayName = displayName;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (preferences !== undefined) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    user.updatedBy = req.user._id;
    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
        bio: user.bio,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        isVerified: user.isVerified,
        role: user.role,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete user account
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Soft delete
    user.deletedAt = new Date();
    user.deletedBy = req.user._id;
    user.isActive = false;
    user.refreshTokens = [];
    await user.save();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};