// Simple bcrypt-compatible wrapper using Node.js crypto
const crypto = require('crypto');

// Generate a salt
function generateSalt(rounds = 10) {
  return crypto.randomBytes(16).toString('hex');
}

// Hash a password
function hash(data, saltRounds = 10) {
  return new Promise((resolve, reject) => {
    try {
      const salt = generateSalt();
      const hash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
      resolve(`$2b$${saltRounds}$${salt}${hash}`);
    } catch (error) {
      reject(error);
    }
  });
}

// Compare password with hash
function compare(data, encrypted) {
  return new Promise((resolve, reject) => {
    try {
      // Parse the hash format: $2b$rounds$salt+hash
      const parts = encrypted.split('$');
      if (parts.length !== 4 || parts[0] !== '' || parts[1] !== '2b') {
        return resolve(false);
      }
      
      const rounds = parseInt(parts[2]);
      const saltAndHash = parts[3];
      const salt = saltAndHash.substring(0, 32); // First 32 chars are salt
      const originalHash = saltAndHash.substring(32); // Rest is hash
      
      const testHash = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
      resolve(testHash === originalHash);
    } catch (error) {
      resolve(false);
    }
  });
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
  } catch (error) {
    return false;
  }
}

module.exports = {
  hash,
  compare,
  hashSync,
  compareSync,
  generateSalt
}; 