import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  signup,
  login,
  refreshToken,
  logout,
  logoutAll,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
  deleteAccount,
  validateSignup,
  validateLogin,
  validatePasswordReset,
  validatePasswordChange
} from '../controllers/authController.js';
import {
  authenticate,
  verifyProjectAccess,
  requireEmailVerification,
  optionalAuth
} from '../middleware/auth.js';

const router = express.Router();

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (with project verification)
router.post('/signup', authLimiter, verifyProjectAccess, validateSignup, signup);
router.post('/login', authLimiter, verifyProjectAccess, validateLogin, login);
router.post('/refresh-token', generalLimiter, refreshToken);
router.get('/verify-email', generalLimiter, verifyEmail);
router.post('/request-password-reset', authLimiter, optionalAuth, validatePasswordReset, requestPasswordReset);
router.post('/reset-password', authLimiter, validatePasswordChange, resetPassword);

// Protected routes (require authentication)
router.use(authenticate); // All routes below require authentication

router.post('/logout', generalLimiter, logout);
router.post('/logout-all', generalLimiter, logoutAll);
router.post('/change-password', authLimiter, validatePasswordChange, changePassword);

// Profile routes
router.get('/profile', generalLimiter, getProfile);
router.put('/profile', generalLimiter, updateProfile);
router.delete('/account', authLimiter, deleteAccount);

// Email verification required routes
router.get('/verified-profile', generalLimiter, requireEmailVerification, getProfile);

export default router;