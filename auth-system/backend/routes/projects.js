import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createProject,
  getUserProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectUsers,
  addTeamMember,
  removeTeamMember,
  updateTeamMemberRole,
  regenerateApiKeys,
  getProjectStats,
  validateProject
} from '../controllers/projectController.js';
import {
  authenticate,
  authorize,
  verifyProjectMember,
  verifyProjectAdmin
} from '../middleware/auth.js';

const router = express.Router();

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 project creations per hour
  message: {
    success: false,
    message: 'Too many projects created, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes require authentication
router.use(authenticate);

// Project CRUD
router.post('/', createLimiter, validateProject, createProject);
router.get('/', generalLimiter, getUserProjects);
router.get('/:projectId', generalLimiter, getProject);
router.put('/:projectId', generalLimiter, validateProject, updateProject);
router.delete('/:projectId', generalLimiter, deleteProject);

// Project statistics
router.get('/:projectId/stats', generalLimiter, getProjectStats);

// Project users management
router.get('/:projectId/users', generalLimiter, getProjectUsers);
router.post('/:projectId/users', generalLimiter, addTeamMember);
router.delete('/:projectId/users/:memberId', generalLimiter, removeTeamMember);
router.put('/:projectId/users/:memberId/role', generalLimiter, updateTeamMemberRole);

// API key management
router.post('/:projectId/regenerate-keys', generalLimiter, regenerateApiKeys);

export default router;