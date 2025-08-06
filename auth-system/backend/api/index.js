import express from 'express';
import cors from 'cors';

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 AuthSystem API - Basic Test',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Health check passed',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Health check passed',
    timestamp: new Date().toISOString()
  });
});

// Basic API test
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API test endpoint working',
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/', '/health', '/api/health', '/api/test']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

export default app; 