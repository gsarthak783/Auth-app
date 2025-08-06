import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

// Authenticate user with JWT token
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }
    
    // Verify token
    const decoded = verifyAccessToken(token);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    // Check if user is suspended
    if (user.isSuspended) {
      if (user.suspendedUntil && user.suspendedUntil > new Date()) {
        return res.status(401).json({
          success: false,
          message: 'Account is suspended',
          suspendedUntil: user.suspendedUntil
        });
      } else if (user.isSuspended && !user.suspendedUntil) {
        return res.status(401).json({
          success: false,
          message: 'Account is permanently suspended'
        });
      }
    }
    
    // Check if account is locked
    if (user.isLocked) {
      return res.status(401).json({
        success: false,
        message: 'Account is locked due to multiple failed login attempts'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
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

// Verify project access with API key
export const verifyProjectAccess = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'Project API key is required'
      });
    }
    
    // Find project by API key
    const project = await Project.findByApiKey(apiKey);
    
    if (!project) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }
    
    // Check if project is active
    if (!project.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Project is deactivated'
      });
    }
    
    // Check if project is suspended
    if (project.isSuspended) {
      return res.status(401).json({
        success: false,
        message: 'Project is suspended'
      });
    }
    
    req.project = project;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying project access'
    });
  }
};

// Verify project member access
export const verifyProjectMember = async (req, res, next) => {
  try {
    if (!req.user || !req.project) {
      return res.status(401).json({
        success: false,
        message: 'Authentication and project verification required'
      });
    }
    
    // Check if user has access to the project
    const hasAccess = req.project.hasAccess(req.user._id);
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'No access to this project'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying project membership'
    });
  }
};

// Verify project admin access
export const verifyProjectAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.project) {
      return res.status(401).json({
        success: false,
        message: 'Authentication and project verification required'
      });
    }
    
    // Check if user has admin access to the project
    const hasAccess = req.project.hasAccess(req.user._id, 'admin');
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required for this project'
      });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error verifying project admin access'
    });
  }
};

// Check if email is verified
export const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      needsVerification: true
    });
  }
  
  next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Rate limiting check
export const checkRateLimit = (req, res, next) => {
  // This would be implemented with a proper rate limiting library
  // For now, just continue
  next();
};