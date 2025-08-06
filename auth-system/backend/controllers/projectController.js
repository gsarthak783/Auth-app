import { body, validationResult } from 'express-validator';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { generateApiKey, generateApiSecret } from '../utils/jwt.js';

// Validation rules
export const validateProject = [
  body('name').isLength({ min: 1, max: 100 }).trim().withMessage('Project name is required (1-100 characters)'),
  body('description').optional().isLength({ max: 500 }).trim()
];

// Create new project
export const createProject = async (req, res) => {
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

    const { name, description, settings, allowedDomains, allowedOrigins } = req.body;
    const userId = req.user.userId;
    
    console.log('🚀 Creating project:', { 
      name, 
      userId, 
      userObject: req.user,
      userIdType: typeof userId 
    });

    // Generate API credentials
    const apiKey = generateApiKey();
    const apiSecret = generateApiSecret();

    // Create project
    const project = new Project({
      name,
      description,
      apiKey,
      apiSecret,
      allowedDomains: allowedDomains || [],
      allowedOrigins: allowedOrigins || [],
      settings: {
        ...settings,
        // Ensure default settings
        allowSignup: settings?.allowSignup !== undefined ? settings.allowSignup : true,
        requireEmailVerification: settings?.requireEmailVerification !== undefined ? settings.requireEmailVerification : true,
        minPasswordLength: settings?.minPasswordLength || 6,
        sessionTimeout: settings?.sessionTimeout || 15,
        maxSessions: settings?.maxSessions || 5,
        enableAccountLocking: settings?.enableAccountLocking !== undefined ? settings.enableAccountLocking : true,
        maxLoginAttempts: settings?.maxLoginAttempts || 5,
        lockoutDuration: settings?.lockoutDuration || 120
      },
      owner: userId,
      createdBy: userId
    });

    await project.save();

    // Update user's project access and stats
    const user = await User.findById(userId);
    
    // Initialize projectAccess if it doesn't exist (for existing users)
    if (!user.projectAccess) {
      user.projectAccess = [];
    }
    
    user.projectAccess.push({
      projectId: project._id,
      role: 'owner',
      joinedAt: new Date()
    });
    
    // Update user stats - increment total projects
    if (!user.stats) user.stats = {};
    user.stats.totalProjects = (user.stats.totalProjects || 0) + 1;
    
    await user.save();

    console.log('✅ Project created successfully:', {
      projectId: project._id,
      projectName: project.name,
      userTotalProjects: user.stats.totalProjects
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        apiKey: project.apiKey,
        allowedDomains: project.allowedDomains,
        allowedOrigins: project.allowedOrigins,
        settings: project.settings,
        stats: project.stats,
        isActive: project.isActive,
        createdAt: project.createdAt
      }
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's projects
export const getUserProjects = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const projects = await Project.findUserProjects(userId)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments({
      $or: [
        { owner: userId },
        { 'team.user': userId }
      ],
      isActive: true,
      deletedAt: { $exists: false }
    });

    res.json({
      success: true,
      projects: projects.map(project => ({
        id: project._id,
        name: project.name,
        description: project.description,
        apiKey: project.apiKey,
        role: project.owner.toString() === userId.toString() ? 'owner' : 
              project.team.find(member => member.user._id.toString() === userId.toString())?.role,
        stats: project.stats,
        isActive: project.isActive,
        createdAt: project.createdAt,
        teamCount: project.teamCount
      })),
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get project details
export const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId)
      .populate('owner', 'username email displayName')
      .populate('team.user', 'username email displayName');

    if (!project || project.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Debug access check
    console.log('🔍 Access check debug:', {
      userId: userId,
      userIdType: typeof userId,
      projectOwner: project.owner,
      projectOwnerId: project.owner?._id || project.owner,
      ownerType: typeof (project.owner?._id || project.owner),
      teamMembers: project.team?.length || 0,
      teamUserIds: project.team?.map(member => member.user?._id || member.user) || []
    });

    // Check if user has access
    if (!project.hasAccess(userId)) {
      console.log('❌ Access denied for user:', userId);
      return res.status(403).json({
        success: false,
        message: 'No access to this project'
      });
    }

    console.log('✅ Access granted for user:', userId);

    const ownerId = project.owner?._id || project.owner;
    const userRole = ownerId && ownerId.toString() === userId.toString() ? 'owner' :
                    project.team.find(member => {
                      const memberId = member.user?._id || member.user;
                      return memberId && memberId.toString() === userId.toString();
                    })?.role;

    res.json({
      success: true,
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        apiKey: project.apiKey,
        allowedDomains: project.allowedDomains,
        allowedOrigins: project.allowedOrigins,
        settings: project.settings,
        emailTemplates: project.emailTemplates,
        stats: project.stats,
        isActive: project.isActive,
        owner: project.owner,
        team: project.team,
        userRole,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update project
export const updateProject = async (req, res) => {
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

    const { projectId } = req.params;
    const userId = req.user.userId;
    const {
      name,
      description,
      allowedDomains,
      allowedOrigins,
      settings,
      emailTemplates
    } = req.body;

    const project = await Project.findById(projectId);

    if (!project || project.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has admin access
    if (!project.hasAccess(userId, 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Update fields
    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (allowedDomains !== undefined) project.allowedDomains = allowedDomains;
    if (allowedOrigins !== undefined) project.allowedOrigins = allowedOrigins;
    
    if (settings !== undefined) {
      project.settings = { ...project.settings, ...settings };
    }
    
    if (emailTemplates !== undefined) {
      project.emailTemplates = { ...project.emailTemplates, ...emailTemplates };
    }

    project.updatedBy = userId;
    await project.save();

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
        apiKey: project.apiKey,
        allowedDomains: project.allowedDomains,
        allowedOrigins: project.allowedOrigins,
        settings: project.settings,
        emailTemplates: project.emailTemplates,
        updatedAt: project.updatedAt
      }
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project || project.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only owner can delete project
    if (project.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can delete the project'
      });
    }

    // Soft delete
    project.deletedAt = new Date();
    project.deletedBy = userId;
    project.isActive = false;
    await project.save();

    // Remove project access from all users
    await User.updateMany(
      { 'projectAccess.projectId': projectId },
      { $pull: { projectAccess: { projectId } } }
    );

    // Decrement project count for the owner
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalProjects': -1 }
    });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get project users
export const getProjectUsers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;
    const { page = 1, limit = 20, search, role, status } = req.query;

    const project = await Project.findById(projectId);

    if (!project || project.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access
    if (!project.hasAccess(userId)) {
      return res.status(403).json({
        success: false,
        message: 'No access to this project'
      });
    }

    // Build query
    const query = {
      'projectAccess.projectId': projectId,
      deletedAt: { $exists: false }
    };

    if (search) {
      query.$or = [
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      if (status === 'verified') query.isVerified = true;
      if (status === 'unverified') query.isVerified = false;
      if (status === 'active') query.isActive = true;
      if (status === 'inactive') query.isActive = false;
      if (status === 'suspended') query.isSuspended = true;
    }

    const users = await User.find(query)
      .select('email username firstName lastName displayName avatar isVerified isActive isSuspended lastLogin createdAt projectAccess')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    // Filter and map users with their project role
    const projectUsers = users.map(user => {
      const projectAccess = user.projectAccess.find(
        access => access.projectId.toString() === projectId
      );

      return {
        id: user._id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatar: user.avatar,
        isVerified: user.isVerified,
        isActive: user.isActive,
        isSuspended: user.isSuspended,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        projectRole: projectAccess?.role || 'member',
        joinedAt: projectAccess?.joinedAt
      };
    }).filter(user => !role || user.projectRole === role);

    res.json({
      success: true,
      users: projectUsers,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
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

// Add team member
export const addTeamMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userIdOrEmail, role = 'member', permissions = [] } = req.body;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project || project.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has admin access
    if (!project.hasAccess(userId, 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Find target user
    const targetUser = await User.findOne({
      $or: [
        { _id: userIdOrEmail },
        { email: userIdOrEmail },
        { username: userIdOrEmail }
      ],
      deletedAt: { $exists: false }
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add to project team
    await project.addTeamMember(targetUser._id, role, permissions);

    // Update user's project access
    const existingAccess = targetUser.projectAccess.find(
      access => access.projectId.toString() === projectId
    );

    if (existingAccess) {
      existingAccess.role = role;
      existingAccess.permissions = permissions;
    } else {
      targetUser.projectAccess.push({
        projectId,
        role,
        permissions,
        joinedAt: new Date()
      });
    }

    await targetUser.save();

    res.json({
      success: true,
      message: 'Team member added successfully',
      user: {
        id: targetUser._id,
        email: targetUser.email,
        username: targetUser.username,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        role
      }
    });

  } catch (error) {
    console.error('Add team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Remove team member
export const removeTeamMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project || project.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has admin access
    if (!project.hasAccess(userId, 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Cannot remove owner
    if (project.owner.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project owner'
      });
    }

    // Remove from project team
    await project.removeTeamMember(memberId);

    // Remove from user's project access
    await User.findByIdAndUpdate(memberId, {
      $pull: { projectAccess: { projectId } }
    });

    res.json({
      success: true,
      message: 'Team member removed successfully'
    });

  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update team member role
export const updateTeamMemberRole = async (req, res) => {
  try {
    const { projectId, memberId } = req.params;
    const { role, permissions = [] } = req.body;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project || project.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has admin access
    if (!project.hasAccess(userId, 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    // Cannot change owner role
    if (project.owner.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change owner role'
      });
    }

    // Update project team
    await project.addTeamMember(memberId, role, permissions);

    // Update user's project access
    await User.findOneAndUpdate(
      { _id: memberId, 'projectAccess.projectId': projectId },
      {
        $set: {
          'projectAccess.$.role': role,
          'projectAccess.$.permissions': permissions
        }
      }
    );

    res.json({
      success: true,
      message: 'Team member role updated successfully'
    });

  } catch (error) {
    console.error('Update team member role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Regenerate API keys
export const regenerateApiKeys = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project || project.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only owner can regenerate API keys
    if (project.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can regenerate API keys'
      });
    }

    // Generate new API credentials
    project.apiKey = generateApiKey();
    project.apiSecret = generateApiSecret();
    project.updatedBy = userId;
    await project.save();

    res.json({
      success: true,
      message: 'API keys regenerated successfully',
      apiKey: project.apiKey,
      apiSecret: project.apiSecret
    });

  } catch (error) {
    console.error('Regenerate API keys error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get project stats
export const getProjectStats = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);

    if (!project || project.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user has access
    if (!project.hasAccess(userId)) {
      return res.status(403).json({
        success: false,
        message: 'No access to this project'
      });
    }

    // Get additional stats
    const stats = await User.aggregate([
      {
        $match: {
          'projectAccess.projectId': project._id,
          deletedAt: { $exists: false }
        }
      },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          verifiedUsers: { $sum: { $cond: ['$isVerified', 1, 0] } },
          activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
          suspendedUsers: { $sum: { $cond: ['$isSuspended', 1, 0] } }
        }
      }
    ]);

    const projectStats = stats[0] || {
      totalUsers: 0,
      verifiedUsers: 0,
      activeUsers: 0,
      suspendedUsers: 0
    };

    res.json({
      success: true,
      stats: {
        ...project.stats,
        ...projectStats,
        totalLogins: project.stats.totalLogins,
        lastLogin: project.stats.lastLogin
      }
    });

  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
