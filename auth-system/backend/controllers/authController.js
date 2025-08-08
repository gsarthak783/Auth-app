const { validationResult } = require('express-validator');
const User = require('../models/User.js');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.js');
const { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email.js');
const crypto = require('crypto');

// Platform User Registration (no API key required)
const signup = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, username, password, firstName, lastName, company, website } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Check username uniqueness
    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Create new platform user
    const user = new User({
      email,
      username,
      password,
      firstName,
      lastName,
      company,
      website,
      isVerified: true, // Platform users are auto-verified
      signupSource: 'web',
      signupIP: req.ip,
      signupUserAgent: req.get('User-Agent')
    });

    await user.save();

    // Send welcome email (non-blocking) — disabled by default to avoid test mails
    try {
      if (process.env.SEND_PLATFORM_WELCOME === 'true') {
        await sendWelcomeEmail(user, 'AuthSystem Platform');
      }
    } catch (emailError) {
      console.error('Failed to send welcome email, but continuing with signup:', emailError.message);
    }

    // Generate tokens
    const accessToken = generateAccessToken({ 
      userId: user._id, 
      type: 'platform_user' 
    });
    const refreshToken = generateRefreshToken({ 
      userId: user._id, 
      type: 'platform_user' 
    });

    // Save refresh token
    user.refreshTokens.push({
      token: refreshToken,
      device: req.get('User-Agent'),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to AuthSystem.',
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          website: user.website,
          subscription: user.subscription,
          limits: user.limits
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('Platform user signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Platform User Login (no API key required)
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, username, password } = req.body;

    // Find user by email or username
    let user;
    if (email) {
      user = await User.findByEmail(email);
    } else if (username) {
      user = await User.findByUsername(username);
    }

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
        message: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if account is suspended
    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended'
      });
    }

    // Verify password
    const passwordResult = await user.comparePassword(password);
    
    // Handle password reset requirement (for legacy bcryptjs hashes)
    if (passwordResult.needsPasswordReset) {
      return res.status(400).json({
        success: false,
        message: 'Your account needs a password reset due to a security update. Please use the forgot password feature.',
        needsPasswordReset: true,
        email: user.email
      });
    }
    
    if (!passwordResult.isValid) {
      await user.incrementLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login and activity
    user.lastLogin = new Date();
    user.lastActiveAt = new Date();
    
    // Add to login history
    user.loginHistory.push({
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
      success: true
    });

    // Keep only last 10 login records
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(-10);
    }

    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken({ 
      userId: user._id, 
      type: 'platform_user' 
    });
    const refreshToken = generateRefreshToken({ 
      userId: user._id, 
      type: 'platform_user' 
    });

    // Save refresh token
    user.refreshTokens.push({
      token: refreshToken,
      device: req.get('User-Agent'),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Limit refresh tokens to 5 per user
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          company: user.company,
          website: user.website,
          subscription: user.subscription,
          limits: user.limits,
          stats: user.stats,
          lastLogin: user.lastLogin
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('Platform user login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      // Find user and check if refresh token exists and is valid
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      }

      const tokenRecord = user.refreshTokens.find(
        token => token.token === refreshToken && token.isActive && token.expiresAt > new Date()
      );

      if (!tokenRecord) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token'
        });
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({ 
        userId: user._id, 
        type: 'platform_user' 
      });

      // Update last active time
      user.lastActiveAt = new Date();
      await user.save();

      res.json({
        success: true,
        data: {
          accessToken: newAccessToken
        }
      });

    } catch (tokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.user.userId);

    if (refreshToken && user) {
      // Remove specific refresh token
      user.refreshTokens = user.refreshTokens.filter(
        token => token.token !== refreshToken
      );
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Debug user stats
    console.log('👤 User profile stats:', {
      userId: user._id,
      totalProjects: user.stats?.totalProjects,
      maxProjects: user.limits?.maxProjects,
      statsObject: user.stats,
      limitsObject: user.limits
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          company: user.company,
          website: user.website,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          isVerified: user.isVerified,
          isActive: user.isActive,
          subscription: user.subscription,
          limits: user.limits,
          stats: user.stats,
          preferences: user.preferences,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
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
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedFields = [
      'firstName', 'lastName', 'displayName', 'avatar', 'bio', 
      'company', 'website', 'phoneNumber', 'dateOfBirth', 'preferences'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          company: user.company,
          website: user.website,
          phoneNumber: user.phoneNumber,
          dateOfBirth: user.dateOfBirth,
          preferences: user.preferences
        }
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

// Change password
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const passwordResult = await user.comparePassword(currentPassword);
    
    // Handle password reset requirement (for legacy bcryptjs hashes)
    if (passwordResult.needsPasswordReset) {
      return res.status(400).json({
        success: false,
        message: 'Your account needs a password reset due to a security update. Please use the forgot password feature.',
        needsPasswordReset: true
      });
    }
    
    if (!passwordResult.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Invalidate all refresh tokens for security
    user.refreshTokens = [];
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Request password reset
const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const user = await User.findByEmail(email);

    // Always return success for security reasons
    const successResponse = {
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    };

    if (!user) {
      return res.json(successResponse);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send reset email (non-blocking)
    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email, but continuing:', emailError.message);
    }

    res.json(successResponse);

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reset password
const resetPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    // Invalidate all refresh tokens for security
    user.refreshTokens = [];
    
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Soft delete user and modify email to allow reuse
    const timestamp = Date.now();
    user.deletedAt = new Date();
    user.isActive = false;
    user.refreshTokens = [];
    // Append timestamp to email to make it unique and allow original email reuse
    user.email = `${user.email}.deleted.${timestamp}`;
    // Also modify username if it exists
    if (user.username) {
      user.username = `${user.username}.deleted.${timestamp}`;
    }
    // Reset project count since all projects will be deleted
    if (!user.stats) user.stats = {};
    user.stats.totalProjects = 0;
    await user.save();

    // Soft delete all user's projects
    const Project = require('../models/Project.js');
    const ProjectUser = require('../models/ProjectUser.js');
    
    const userProjects = await Project.find({ 
      owner: user._id, 
      deletedAt: { $exists: false } 
    });

    // Soft delete each project and its users
    for (const project of userProjects) {
      project.deletedAt = new Date();
      project.deletedBy = user._id;
      project.isActive = false;
      await project.save();

      // Soft delete all project users
      await ProjectUser.updateMany(
        { projectId: project._id, deletedAt: { $exists: false } },
        { 
          deletedAt: new Date(),
          isActive: false 
        }
      );
    }

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

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
  deleteAccount
};