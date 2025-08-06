import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import projectUsersRoutes from './routes/projectUsers.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window per IP (increased for production)
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalRateLimit);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip;
  
  console.log(`[${timestamp}] ${method} ${url} - ${ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AuthSystem API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API Documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'AuthSystem API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        base: '/api/auth',
        description: 'Platform user authentication endpoints',
        routes: [
          'POST /signup - Register platform user',
          'POST /login - Login platform user',
          'POST /refresh - Refresh access token',
          'POST /logout - Logout user',
          'GET /profile - Get user profile',
          'PUT /profile - Update user profile',
          'POST /change-password - Change password',
          'POST /forgot-password - Request password reset',
          'POST /reset-password - Reset password',
          'DELETE /delete-account - Delete account'
        ]
      },
      projects: {
        base: '/api/projects',
        description: 'Project management endpoints',
        routes: [
          'GET / - Get user projects',
          'POST / - Create new project',
          'GET /:id - Get project details',
          'PUT /:id - Update project',
          'DELETE /:id - Delete project',
          'GET /:id/stats - Get project statistics'
        ]
      },
      projectUsers: {
        base: '/api/project-users',
        description: 'Project user authentication and management',
        routes: [
          'POST /register - Register project user (requires API key)',
          'POST /login - Login project user (requires API key)',
          'GET /profile - Get project user profile',
          'PUT /profile - Update project user profile',
          'GET / - Get all project users (admin)',
          'GET /stats - Get project user statistics (admin)',
          'DELETE /:userId - Delete project user (admin)',
          'PATCH /:userId/status - Update user status (admin)'
        ]
      }
    },
    authentication: {
      platformUsers: {
        description: 'Platform users (who create and manage projects)',
        tokenType: 'Bearer JWT',
        header: 'Authorization: Bearer <token>'
      },
      projectUsers: {
        description: 'End-users of individual projects',
        tokenType: 'Bearer JWT + API Key',
        headers: [
          'Authorization: Bearer <token>',
          'x-api-key: <project-api-key>'
        ]
      }
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/project-users', projectUsersRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.path,
    availableEndpoints: ['/api', '/health', '/api/auth', '/api/projects', '/api/project-users']
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
      field
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }

  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation'
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 AuthSystem API Server Started
  
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api
💊 Health: http://localhost:${PORT}/health

🔗 Available Endpoints:
  • Platform Auth: http://localhost:${PORT}/api/auth
  • Projects: http://localhost:${PORT}/api/projects  
  • Project Users: http://localhost:${PORT}/api/project-users

📝 Logs: Server will log all requests
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Shutting down gracefully...');
  await mongoose.connection.close();
  console.log('MongoDB connection closed.');
  process.exit(0);
});

export default app;