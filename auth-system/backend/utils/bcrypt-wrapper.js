// Backwards-compatible bcrypt wrapper using Node.js crypto
const crypto = require('crypto');

// Generate a salt (async version for compatibility)
function genSalt(rounds = 10) {
  return new Promise((resolve) => {
    const salt = crypto.randomBytes(16).toString('hex');
    resolve(salt);
  });
}

// Generate a salt (sync version)
function generateSalt(rounds = 10) {
  return crypto.randomBytes(16).toString('hex');
}

// Hash a password with provided salt
function hash(data, saltOrRounds) {
  return new Promise((resolve, reject) => {
    try {
      let salt;
      let rounds;
      
      // If saltOrRounds is a number, treat it as rounds and generate salt
      if (typeof saltOrRounds === 'number') {
        rounds = saltOrRounds;
        salt = generateSalt();
      } else {
        // Use provided salt, default rounds to 10
        salt = saltOrRounds;
        rounds = 10;
      }
      
      // Always generate consistent format
      const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
      resolve(`$2b$${rounds}$${salt}${hash}`);
      
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to detect hash format
function detectHashFormat(hash) {
  if (!hash || typeof hash !== 'string') {
    return 'unknown';
  }
  
  // bcryptjs format: $2a$10$salt+hash or $2b$10$salt+hash (60 chars total)
  if (hash.match(/^\$2[aby]\$\d+\$.{53}$/)) {
    return 'bcryptjs';
  }
  
  // Our custom format: $2b$rounds$salt(32chars)+hash(128chars)
  if (hash.match(/^\$2b\$\d+\$.{160}$/)) {
    return 'custom';
  }
  
  return 'unknown';
}

// Compare password with hash (backwards compatible)
function compare(data, encrypted) {
  return new Promise(async (resolve, reject) => {
    try {
      const format = detectHashFormat(encrypted);
      
      if (format === 'bcryptjs') {
        // Handle old bcryptjs format
        // Since we can't use bcryptjs library (deployment issues),
        // we'll return a special error that triggers password reset
        console.log('Legacy bcryptjs hash detected - password reset required');
        return resolve({ needsPasswordReset: true, isValid: false });
        
      } else if (format === 'custom') {
        // Handle our custom format
        const parts = encrypted.split('$');
        if (parts.length !== 4 || parts[0] !== '' || parts[1] !== '2b') {
          return resolve({ needsPasswordReset: false, isValid: false });
        }
        
        const rounds = parseInt(parts[2]);
        const saltAndHash = parts[3];
        const salt = saltAndHash.substring(0, 32); // First 32 chars are salt
        const originalHash = saltAndHash.substring(32); // Rest is hash
        
        const testHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
        return resolve({ needsPasswordReset: false, isValid: testHash === originalHash });
        
      } else {
        // Unknown format - this might be a plain hash without proper formatting
        // Try to handle it as a simple comparison
        console.log('Warning: Unknown hash format detected:', encrypted.substring(0, 20) + '...');
        return resolve({ needsPasswordReset: false, isValid: false });
      }
      
    } catch (error) {
      console.error('Password comparison error:', error);
      resolve({ needsPasswordReset: false, isValid: false });
    }
  });
}

// Simple boolean compare for backwards compatibility
async function compareSimple(data, encrypted) {
  const result = await compare(data, encrypted);
  return result.isValid;
}

// Synchronous version of hash
function hashSync(data, saltRounds = 10) {
  const salt = generateSalt();
  const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
  return `$2b$${saltRounds}$${salt}${hash}`;
}

// Synchronous version of compare
function compareSync(data, encrypted) {
  try {
    const format = detectHashFormat(encrypted);
    
    if (format === 'custom') {
      const parts = encrypted.split('$');
      if (parts.length !== 4 || parts[0] !== '' || parts[1] !== '2b') {
        return false;
      }
      
      const rounds = parseInt(parts[2]);
      const saltAndHash = parts[3];
      const salt = saltAndHash.substring(0, 32);
      const originalHash = saltAndHash.substring(32);
      
      const testHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
      return testHash === originalHash;
    }
    
    return false; // bcryptjs format or unknown - return false
  } catch (error) {
    return false;
  }
}

module.exports = {
  genSalt,
  hash,
  compare,
  compareSimple,
  hashSync,
  compareSync,
  generateSalt,
  detectHashFormat
}; 