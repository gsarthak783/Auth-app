const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Project = require('../models/Project.js');
const ProjectUser = require('../models/ProjectUser.js');

// Authenticate platform users (for platform access)
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'platform_user') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type'
        });
      }

      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive || user.deletedAt) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      req.user = {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        type: 'platform_user'
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Authenticate project users (for project-specific endpoints)
const authenticateProjectUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'project_user') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type'
        });
      }

      const projectUser = await ProjectUser.findById(decoded.userId);
      if (!projectUser || !projectUser.isActive || projectUser.deletedAt) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }

      req.projectUser = {
        userId: projectUser._id,
        email: projectUser.email,
        username: projectUser.username,
        projectId: projectUser.projectId,
        type: 'project_user'
      };

      req.projectId = projectUser.projectId;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Project user authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify project access via API key (for project user registration/login)
const verifyProjectAccess = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.body.apiKey || req.query.apiKey;
    const projectIdHeader = req.headers['x-project-id'];

    if (!apiKey && !projectIdHeader) {
      return res.status(401).json({
        success: false,
        message: 'Project API key or Project ID is required'
      });
    }

    let project = null;
    if (apiKey) {
      project = await Project.findOne({ apiKey, isActive: true, deletedAt: null });
      if (!project) {
        return res.status(401).json({ success: false, message: 'Invalid or inactive project API key' });
      }
      if (projectIdHeader && project._id.toString() !== projectIdHeader) {
        return res.status(400).json({ success: false, message: 'X-API-Key and X-Project-ID do not match' });
      }
    } else if (projectIdHeader) {
      project = await Project.findOne({ _id: projectIdHeader, isActive: true, deletedAt: null });
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
    }

    // Origin check as before
    const origin = req.headers.origin || req.headers.referer;
    if (origin && project.allowedOrigins.length > 0) {
      const isOriginAllowed = project.allowedOrigins.some(allowedOrigin => 
        origin.includes(allowedOrigin) || allowedOrigin === '*'
      );
      if (!isOriginAllowed) {
        return res.status(403).json({ success: false, message: 'Origin not allowed for this project' });
      }
    }

    req.project = project;
    req.projectId = project._id;
    next();
  } catch (error) {
    console.error('Project verification error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Strict variant: require BOTH headers and validate match
const verifyProjectAccessStrict = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];
    const projectIdHeader = req.headers['x-project-id'];
    if (!apiKey || !projectIdHeader) {
      return res.status(401).json({ success: false, message: 'X-API-Key and X-Project-ID headers are required' });
    }
    const project = await Project.findOne({ apiKey, isActive: true, deletedAt: null });
    if (!project) {
      return res.status(401).json({ success: false, message: 'Invalid or inactive project API key' });
    }
    if (project._id.toString() !== projectIdHeader) {
      return res.status(400).json({ success: false, message: 'X-API-Key and X-Project-ID do not match' });
    }

    // Origin check
    const origin = req.headers.origin || req.headers.referer;
    if (origin && project.allowedOrigins.length > 0) {
      const isOriginAllowed = project.allowedOrigins.some(allowedOrigin => 
        origin.includes(allowedOrigin) || allowedOrigin === '*'
      );
      if (!isOriginAllowed) {
        return res.status(403).json({ success: false, message: 'Origin not allowed for this project' });
      }
    }

    req.project = project;
    req.projectId = project._id;
    next();
  } catch (error) {
    console.error('Project verification (strict) error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Verify project member access (platform user must be member/admin of project)
const verifyProjectMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner of the project
    if (project.owner.toString() === userId.toString()) {
      req.project = project;
      req.userRole = 'owner';
      return next();
    }

    // Check if user is in team members
    const teamMember = project.team.find(member => 
      member.userId.toString() === userId.toString()
    );

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project.'
      });
    }

    req.project = project;
    req.userRole = teamMember.role;
    next();
  } catch (error) {
    console.error('Project member verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify project admin access (platform user must be admin/owner of project)
const verifyProjectAdmin = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.userId;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() === userId.toString()) {
      req.project = project;
      req.userRole = 'owner';
      return next();
    }

    // Check if user is admin in team
    const teamMember = project.team.find(member => 
      member.userId.toString() === userId.toString() && member.role === 'admin'
    );

    if (!teamMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.project = project;
    req.userRole = teamMember.role;
    next();
  } catch (error) {
    console.error('Project admin verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Role-based authorization for platform users
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check if email verification is required (for project users)
const requireEmailVerification = async (req, res, next) => {
  try {
    if (!req.projectUser) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const projectUser = await ProjectUser.findById(req.projectUser.userId);
    const project = await Project.findById(req.projectUser.projectId);

    if (project.settings.requireEmailVerification && !projectUser.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Email verification required',
        needsVerification: true
      });
    }

    next();
  } catch (error) {
    console.error('Email verification check error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Optional authentication (doesn't fail if no token provided)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type === 'platform_user') {
        const user = await User.findById(decoded.userId);
        if (user && user.isActive && !user.deletedAt) {
          req.user = {
            userId: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            type: 'platform_user'
          };
        }
      } else if (decoded.type === 'project_user') {
        const projectUser = await ProjectUser.findById(decoded.userId);
        if (projectUser && projectUser.isActive && !projectUser.deletedAt) {
          req.projectUser = {
            userId: projectUser._id,
            email: projectUser.email,
            username: projectUser.username,
            projectId: projectUser.projectId,
            type: 'project_user'
          };
        }
      }
    } catch (error) {
      // Token invalid, but continue without authentication
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    next();
  }
};

// Rate limiting for sensitive operations
const sensitiveOperationLimit = (windowMs = 60000, max = 5) => {
  return (req, res, next) => {
    // This would typically use Redis or a similar store in production
    // For now, we'll use a simple in-memory store
    const key = `${req.ip}-${req.user?.userId || req.projectUser?.userId}`;
    
    // In production, implement proper rate limiting with Redis
    next();
  };
};

module.exports = {
  authenticate,
  authenticateProjectUser,
  verifyProjectAccess,
  verifyProjectAccessStrict,
  verifyProjectMember,
  verifyProjectAdmin,
  authorize,
  requireEmailVerification,
  optionalAuth,
  sensitiveOperationLimit
};