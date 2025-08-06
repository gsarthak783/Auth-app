import express from 'express';
import rateLimit from 'express-rate-limit';
import {
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
  max: 50, // increased from 5 to 50 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // increased from 100 to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (platform users - no project verification needed)
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/refresh-token', generalLimiter, refreshToken);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Protected routes (require authentication)
router.use(authenticate); // All routes below require authentication

router.post('/logout', generalLimiter, logout);
router.post('/change-password', authLimiter, changePassword);

// Profile routes
router.get('/profile', generalLimiter, getProfile);
router.put('/profile', generalLimiter, updateProfile);
router.delete('/account', authLimiter, deleteAccount);

// Email verification required routes
router.get('/verified-profile', generalLimiter, requireEmailVerification, getProfile);

export default router;