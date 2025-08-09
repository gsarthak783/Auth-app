// Environment-specific configuration
const getEnvironmentConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    frontendUrl: isProduction 
      ? 'https://access-kit.vercel.app' 
      : (process.env.FRONTEND_URL || 'http://localhost:5173'),
    
    // Add other environment-specific configs here as needed
    cors: {
      origin: true, // Allow all origins
      credentials: true
    }
  };
};

module.exports = { getEnvironmentConfig }; 