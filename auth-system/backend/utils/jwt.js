import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate access token
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
    issuer: 'auth-system',
    audience: 'auth-system-users'
  });
};

// Generate refresh token
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    issuer: 'auth-system',
    audience: 'auth-system-users'
  });
};

// Verify access token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'auth-system',
      audience: 'auth-system-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
      issuer: 'auth-system',
      audience: 'auth-system-users'
    });
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

// Generate API key
export const generateApiKey = () => {
  return 'ak_' + crypto.randomBytes(32).toString('hex');
};

// Generate API secret
export const generateApiSecret = () => {
  return 'as_' + crypto.randomBytes(32).toString('hex');
};

// Generate random token
export const generateRandomToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate verification token
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate password reset token
export const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hash token for database storage
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Get token expiration time
export const getTokenExpiration = (type = 'access') => {
  const now = new Date();
  
  switch (type) {
    case 'access':
      return new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes
    case 'refresh':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
    case 'verification':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    case 'reset':
      return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
    default:
      return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
  }
};

// Extract token from request headers
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

// Generate token pair
export const generateTokenPair = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: process.env.JWT_EXPIRE || '15m',
    tokenType: 'Bearer'
  };
};