import { validationResult } from 'express-validator';
import ProjectUser from '../models/ProjectUser.js';
import Project from '../models/Project.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { sendWelcomeEmail, sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js';
import crypto from 'crypto';
// CSV imports temporarily disabled for deployment stability
// import { Parser } from 'json2csv';
// import csv from 'csv-parser';
// import { Readable } from 'stream';

// Register a new user for a specific project
export const registerProjectUser = async (req, res) => {
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

    const { email, username, password, firstName, lastName, customFields } = req.body;
    const { projectId } = req;

    // Get project to check settings
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!project.settings.allowSignup) {
      return res.status(403).json({
        success: false,
        message: 'User registration is disabled for this project'
      });
    }

    // Check if user already exists in this project
    const existingUser = await ProjectUser.findByEmail(projectId, email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Check username uniqueness within project
    if (username) {
      const existingUsername = await ProjectUser.findByUsername(projectId, username);
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username already taken'
        });
      }
    }

    // Validate password requirements
    if (project.settings.minPasswordLength && password.length < project.settings.minPasswordLength) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${project.settings.minPasswordLength} characters long`
      });
    }

    // Create new project user
    const projectUser = new ProjectUser({
      email,
      username,
      password,
      firstName,
      lastName,
      projectId,
      customFields: customFields || {},
      isVerified: !project.settings.requireEmailVerification,
      signupIP: req.ip,
      signupUserAgent: req.get('User-Agent')
    });

    // Generate email verification token if required
    if (project.settings.requireEmailVerification) {
      projectUser.emailVerificationToken = crypto.randomBytes(32).toString('hex');
      projectUser.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }

    await projectUser.save();

    // Send verification email if required (non-blocking)
    try {
      if (project.settings.requireEmailVerification) {
        await sendVerificationEmail(
          projectUser.email,
          projectUser.emailVerificationToken,
          project.name
        );
      } else {
        // Send welcome email
        await sendWelcomeEmail(projectUser, project.name);
      }
    } catch (emailError) {
      console.error('Failed to send email during project user registration:', emailError.message);
    }

    // Generate tokens
    const accessToken = generateAccessToken({ 
      userId: projectUser._id, 
      projectId,
      type: 'project_user' 
    });
    const refreshToken = generateRefreshToken({ 
      userId: projectUser._id, 
      projectId,
      type: 'project_user' 
    });

    // Save refresh token
    projectUser.sessions.push({
      token: refreshToken,
      device: req.get('User-Agent'),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    await projectUser.save();

    // Update project statistics
    await Project.findByIdAndUpdate(projectId, {
      $inc: { 'statistics.totalUsers': 1 }
    });

    res.status(201).json({
      success: true,
      message: project.settings.requireEmailVerification 
        ? 'User created successfully. Please check your email to verify your account.'
        : 'User created successfully',
      data: {
        user: {
          id: projectUser._id,
          email: projectUser.email,
          username: projectUser.username,
          firstName: projectUser.firstName,
          lastName: projectUser.lastName,
          isVerified: projectUser.isVerified,
          customFields: projectUser.customFields
        },
        tokens: {
          accessToken,
          refreshToken
        },
        needsVerification: project.settings.requireEmailVerification
      }
    });

  } catch (error) {
    console.error('Project user registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login project user
export const loginProjectUser = async (req, res) => {
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
    const { projectId } = req;

    // Find user by email or username
    let projectUser;
    if (email) {
      projectUser = await ProjectUser.findByEmail(projectId, email);
    } else if (username) {
      projectUser = await ProjectUser.findByUsername(projectId, username);
    }

    if (!projectUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (projectUser.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to too many failed login attempts'
      });
    }

    // Check if account is active
    if (!projectUser.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if account is suspended
    if (projectUser.isSuspended) {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended'
      });
    }

    // Verify password
    const isValidPassword = await projectUser.comparePassword(password);
    if (!isValidPassword) {
      await projectUser.incrementLoginAttempts();
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email verification is required
    const project = await Project.findById(projectId);
    if (project.settings.requireEmailVerification && !projectUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your email before logging in',
        needsVerification: true
      });
    }

    // Reset login attempts on successful login
    if (projectUser.loginAttempts > 0) {
      await projectUser.resetLoginAttempts();
    }

    // Update last login
    projectUser.lastLogin = new Date();
    projectUser.lastActiveAt = new Date();
    await projectUser.save();

    // Generate tokens
    const accessToken = generateAccessToken({ 
      userId: projectUser._id, 
      projectId,
      type: 'project_user' 
    });
    const refreshToken = generateRefreshToken({ 
      userId: projectUser._id, 
      projectId,
      type: 'project_user' 
    });

    // Save refresh token
    projectUser.sessions.push({
      token: refreshToken,
      device: req.get('User-Agent'),
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await projectUser.save();

    // Update project statistics
    await Project.findByIdAndUpdate(projectId, {
      $inc: { 'statistics.totalLogins': 1 }
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: projectUser._id,
          email: projectUser.email,
          username: projectUser.username,
          firstName: projectUser.firstName,
          lastName: projectUser.lastName,
          isVerified: projectUser.isVerified,
          customFields: projectUser.customFields,
          lastLogin: projectUser.lastLogin
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

  } catch (error) {
    console.error('Project user login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get project user profile
export const getProjectUserProfile = async (req, res) => {
  try {
    const projectUser = await ProjectUser.findById(req.projectUser.userId);
    if (!projectUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: projectUser._id,
          email: projectUser.email,
          username: projectUser.username,
          firstName: projectUser.firstName,
          lastName: projectUser.lastName,
          displayName: projectUser.displayName,
          avatar: projectUser.avatar,
          bio: projectUser.bio,
          phoneNumber: projectUser.phoneNumber,
          dateOfBirth: projectUser.dateOfBirth,
          gender: projectUser.gender,
          isVerified: projectUser.isVerified,
          isActive: projectUser.isActive,
          customFields: projectUser.customFields,
          preferences: projectUser.preferences,
          createdAt: projectUser.createdAt,
          lastLogin: projectUser.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get project user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update project user profile
export const updateProjectUserProfile = async (req, res) => {
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
      'phoneNumber', 'dateOfBirth', 'gender', 'customFields', 'preferences'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const projectUser = await ProjectUser.findByIdAndUpdate(
      req.projectUser.userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!projectUser) {
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
          id: projectUser._id,
          email: projectUser.email,
          username: projectUser.username,
          firstName: projectUser.firstName,
          lastName: projectUser.lastName,
          displayName: projectUser.displayName,
          avatar: projectUser.avatar,
          bio: projectUser.bio,
          phoneNumber: projectUser.phoneNumber,
          dateOfBirth: projectUser.dateOfBirth,
          gender: projectUser.gender,
          customFields: projectUser.customFields,
          preferences: projectUser.preferences
        }
      }
    });

  } catch (error) {
    console.error('Update project user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all users for a project (admin only)
export const getProjectUsers = async (req, res) => {
  try {
    const { projectId } = req;
    const { page = 1, limit = 20, search, status, sort = '-createdAt' } = req.query;

    const query = { projectId, deletedAt: null };

    // Add search filter
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    // Add status filter
    if (status) {
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
      if (status === 'verified') query.isVerified = true;
      if (status === 'unverified') query.isVerified = false;
      if (status === 'suspended') query.isSuspended = true;
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      ProjectUser.find(query)
        .select('-password -sessions -emailVerificationToken -passwordResetToken')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      ProjectUser.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get project users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get project user statistics
export const getProjectUserStats = async (req, res) => {
  try {
    const { projectId } = req;

    const [stats] = await ProjectUser.getProjectStats(projectId);

    res.json({
      success: true,
      data: {
        stats: stats || {
          totalUsers: 0,
          activeUsers: 0,
          verifiedUsers: 0,
          suspendedUsers: 0,
          usersToday: 0,
          usersThisWeek: 0
        }
      }
    });

  } catch (error) {
    console.error('Get project user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete project user (admin only)
export const deleteProjectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { projectId } = req;

    const projectUser = await ProjectUser.findOne({ _id: userId, projectId });
    if (!projectUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete
    projectUser.deletedAt = new Date();
    projectUser.isActive = false;
    await projectUser.save();

    // Update project statistics
    await Project.findByIdAndUpdate(projectId, {
      $inc: { 'statistics.totalUsers': -1 }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete project user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update project user status (admin only)
export const updateProjectUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { projectId } = req;
    const { isActive, isSuspended, isVerified } = req.body;

    const updates = {};
    if (typeof isActive === 'boolean') updates.isActive = isActive;
    if (typeof isSuspended === 'boolean') updates.isSuspended = isSuspended;
    if (typeof isVerified === 'boolean') updates.isVerified = isVerified;

    const projectUser = await ProjectUser.findOneAndUpdate(
      { _id: userId, projectId },
      updates,
      { new: true }
    );

    if (!projectUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: {
        user: {
          id: projectUser._id,
          isActive: projectUser.isActive,
          isSuspended: projectUser.isSuspended,
          isVerified: projectUser.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Update project user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Export users endpoint temporarily disabled for deployment stability
// TODO: Re-enable after fixing CSV dependencies
export const exportUsers = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Export feature temporarily unavailable'
  });
  return;
  
  // Original function commented out:
  /*
  try {
    const projectId = req.project.id;
    const { format = 'json', includeCustomFields = true, dateRange } = req.body;
    
    let query = { projectId, deletedAt: { $exists: false } };
    
    // Add date range filter if provided
    if (dateRange && dateRange.from && dateRange.to) {
      query.createdAt = {
        $gte: new Date(dateRange.from),
        $lte: new Date(dateRange.to)
      };
    }
    
    const users = await ProjectUser.find(query)
      .select('-password -emailVerificationToken -passwordResetToken -twoFactorSecret')
      .sort({ createdAt: -1 });
    
    const exportData = {
      users: users.map(user => {
        const userData = {
          id: user._id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatar: user.avatar,
          isVerified: user.isVerified,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        };
        
        if (includeCustomFields && user.customFields) {
          userData.customFields = user.customFields;
        }
        
        return userData;
      }),
      metadata: {
        exportedAt: new Date().toISOString(),
        totalCount: users.length,
        projectId: projectId,
        format: format
      }
    };
    
    if (format === 'csv') {
      const fields = [
        'id', 'email', 'username', 'firstName', 'lastName', 'displayName',
        'isVerified', 'isActive', 'lastLogin', 'createdAt'
      ];
      
      if (includeCustomFields) {
        // Add custom field columns
        const allCustomFields = new Set();
        users.forEach(user => {
          if (user.customFields) {
            Object.keys(user.customFields).forEach(key => allCustomFields.add(`customFields.${key}`));
          }
        });
        fields.push(...Array.from(allCustomFields));
      }
      
      const parser = new Parser({ fields });
      const csvData = parser.parse(exportData.users);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="users-export-${Date.now()}.csv"`);
      res.send(csvData);
    } else {
      res.json(exportData);
    }
    
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export users'
    });
  }
  */
};

// Import users endpoint temporarily disabled for deployment stability  
// TODO: Re-enable after fixing CSV dependencies
export const importUsers = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Import feature temporarily unavailable'
  });
  return;
  
  // Original function commented out:
  /*
  try {
    const projectId = req.project.id;
    const { data, options = {} } = req.body;
    const { updateExisting = false, skipInvalid = true } = options;
    
    if (!data || !data.users || !Array.isArray(data.users)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid import data format'
      });
    }
    
    const results = {
      imported: 0,
      updated: 0,
      skipped: 0,
      errors: []
    };
    
    for (const userData of data.users) {
      try {
        // Validate required fields
        if (!userData.email) {
          if (skipInvalid) {
            results.skipped++;
            continue;
          } else {
            throw new Error('Email is required');
          }
        }
        
        // Check if user already exists
        const existingUser = await ProjectUser.findOne({
          projectId,
          email: userData.email,
          deletedAt: { $exists: false }
        });
        
        if (existingUser) {
          if (updateExisting) {
            // Update existing user
            const updateFields = {};
            if (userData.firstName) updateFields.firstName = userData.firstName;
            if (userData.lastName) updateFields.lastName = userData.lastName;
            if (userData.username) updateFields.username = userData.username;
            if (userData.displayName) updateFields.displayName = userData.displayName;
            if (userData.avatar) updateFields.avatar = userData.avatar;
            if (userData.customFields) updateFields.customFields = userData.customFields;
            if (userData.isActive !== undefined) updateFields.isActive = userData.isActive;
            
            await ProjectUser.findByIdAndUpdate(existingUser._id, updateFields);
            results.updated++;
          } else {
            results.skipped++;
          }
        } else {
          // Create new user
          const newUser = new ProjectUser({
            email: userData.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            username: userData.username,
            displayName: userData.displayName,
            avatar: userData.avatar,
            customFields: userData.customFields || {},
            isActive: userData.isActive !== undefined ? userData.isActive : true,
            isVerified: userData.isVerified || false,
            projectId: projectId,
            // Generate a temporary password that must be reset
            password: Math.random().toString(36).slice(-12)
          });
          
          await newUser.save();
          results.imported++;
        }
      } catch (error) {
        if (skipInvalid) {
          results.errors.push({
            email: userData.email,
            error: error.message
          });
          results.skipped++;
        } else {
          throw error;
        }
      }
    }
    
    res.json({
      success: true,
      message: 'Import completed',
      results
    });
    
  } catch (error) {
    console.error('Import users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import users'
    });
  }
  */
};

// Add get all users endpoint (admin functionality)
export const getAllUsers = async (req, res) => {
  try {
    const projectId = req.project.id;
    const { page = 1, limit = 50, search, status } = req.query;
    
    let query = { projectId, deletedAt: { $exists: false } };
    
    // Add search filter
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add status filter
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    const users = await ProjectUser.find(query)
      .select('-password -emailVerificationToken -passwordResetToken -twoFactorSecret')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await ProjectUser.countDocuments(query);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
    
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users'
    });
  }
};

// Add delete user endpoint
export const deleteUser = async (req, res) => {
  try {
    const projectId = req.project.id;
    const { userId } = req.params;
    
    const user = await ProjectUser.findOne({
      _id: userId,
      projectId,
      deletedAt: { $exists: false }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Soft delete
    user.deletedAt = new Date();
    user.isActive = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
};

// Add update user status endpoint
export const updateUserStatus = async (req, res) => {
  try {
    const projectId = req.project.id;
    const { userId } = req.params;
    const { isActive } = req.body;
    
    const user = await ProjectUser.findOneAndUpdate(
      {
        _id: userId,
        projectId,
        deletedAt: { $exists: false }
      },
      { isActive },
      { new: true }
    ).select('-password -emailVerificationToken -passwordResetToken -twoFactorSecret');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'User status updated successfully'
    });
    
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
};