import express from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import {
  registerProjectUser,
  loginProjectUser,
  getProjectUserProfile,
  updateProjectUserProfile,
  getProjectUsers,
  getProjectUserStats,
  deleteProjectUser,
  updateProjectUserStatus,
  exportUsers,
  importUsers,
  getAllUsers
} from '../controllers/projectUserController.js';
import { verifyProjectAccess, authenticateProjectUser } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting for auth routes
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Validation rules
const validateProjectUserRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().trim().withMessage('First name is required'),
  body('lastName').optional().trim(),
  body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3-30 characters'),
  body('customFields').optional().isObject().withMessage('Custom fields must be an object')
];

const validateProjectUserLogin = [
  body('password').notEmpty().withMessage('Password is required'),
  body('email').optional().isEmail().normalizeEmail(),
  body('username').optional().trim()
];

const validateProfileUpdate = [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim(),
  body('displayName').optional().trim(),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('phoneNumber').optional().trim(),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say']),
  body('customFields').optional().isObject(),
  body('preferences').optional().isObject()
];

// Public routes (require project API key verification)

/**
 * @route   POST /api/project-users/register
 * @desc    Register a new user for a project
 * @access  Public (requires valid project API key)
 */
router.post('/register', 
  authRateLimit,
  verifyProjectAccess,
  validateProjectUserRegistration,
  registerProjectUser
);

/**
 * @route   POST /api/project-users/login
 * @desc    Login project user
 * @access  Public (requires valid project API key)
 */
router.post('/login',
  authRateLimit,
  verifyProjectAccess,
  validateProjectUserLogin,
  loginProjectUser
);

// Protected routes (require project user authentication)

/**
 * @route   GET /api/project-users/profile
 * @desc    Get current project user profile
 * @access  Private (project user)
 */
router.get('/profile',
  authenticateProjectUser,
  getProjectUserProfile
);

/**
 * @route   PUT /api/project-users/profile
 * @desc    Update project user profile
 * @access  Private (project user)
 */
router.put('/profile',
  authenticateProjectUser,
  validateProfileUpdate,
  updateProjectUserProfile
);

// Admin routes (require project access and admin permissions)

/**
 * @route   GET /api/project-users/
 * @desc    Get all users for a project (admin only)
 * @access  Private (project admin)
 */
router.get('/',
  verifyProjectAccess,
  // TODO: Add admin role verification middleware
  getProjectUsers
);

/**
 * @route   GET /api/project-users/stats
 * @desc    Get project user statistics
 * @access  Private (project admin)
 */
router.get('/stats',
  verifyProjectAccess,
  // TODO: Add admin role verification middleware
  getProjectUserStats
);

/**
 * @route   DELETE /api/project-users/:userId
 * @desc    Delete a project user (admin only)
 * @access  Private (project admin)
 */
router.delete('/:userId',
  verifyProjectAccess,
  // TODO: Add admin role verification middleware
  deleteProjectUser
);

/**
 * @route   PATCH /api/project-users/:userId/status
 * @desc    Update project user status (admin only)
 * @access  Private (project admin)
 */
router.patch('/:userId/status',
  verifyProjectAccess,
  // TODO: Add admin role verification middleware
  body('isActive').optional().isBoolean(),
  body('isSuspended').optional().isBoolean(),
  body('isVerified').optional().isBoolean(),
  updateProjectUserStatus
);

/**
 * @route   POST /api/project-users/export
 * @desc    Export users data (admin only)
 * @access  Private (project admin)
 */
router.post('/export',
  verifyProjectAccess,
  // TODO: Add admin role verification middleware
  exportUsers
);

/**
 * @route   POST /api/project-users/import
 * @desc    Import users data (admin only)
 * @access  Private (project admin)
 */
router.post('/import',
  verifyProjectAccess,
  // TODO: Add admin role verification middleware
  importUsers
);

/**
 * @route   GET /api/project-users/users
 * @desc    Get all users with pagination and filtering (admin only)
 * @access  Private (project admin)
 */
router.get('/users',
  verifyProjectAccess,
  // TODO: Add admin role verification middleware
  getAllUsers
);

export default router;