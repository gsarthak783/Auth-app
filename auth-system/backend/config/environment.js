// Environment-specific configuration
const getEnvironmentConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    frontendUrl: isProduction 
      ? 'https://access-kit.vercel.app' 
      : (process.env.FRONTEND_URL || 'http://localhost:5173'),
    
    // Add other environment-specific configs here as needed
    cors: {
      origin: isProduction
        ? ['https://access-kit.vercel.app', 'https://access-kit-server.vercel.app']
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
      credentials: true
    }
  };
};

module.exports = { getEnvironmentConfig }; 