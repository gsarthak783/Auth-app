const express = require('express');
const rateLimit = require('express-rate-limit');
const {
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
} = require('../controllers/projectController.js');
const {
  authenticate,
  authorize,
  verifyProjectMember,
  verifyProjectAdmin
} = require('../middleware/auth.js');

const router = express.Router();

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // increased from 100 to 500 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // increased from 10 to 50 project creations per hour
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

module.exports = router;