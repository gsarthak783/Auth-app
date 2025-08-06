# 🚀 Auth System API Usage Guide

Complete guide for integrating your Auth System with external applications for user authentication.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication Flow](#authentication-flow)
3. [API Endpoints](#api-endpoints)
4. [Frontend Integration Examples](#frontend-integration-examples)
5. [Backend Integration Examples](#backend-integration-examples)
6. [Security Best Practices](#security-best-practices)
7. [Error Handling](#error-handling)
8. [Rate Limits](#rate-limits)

---

## 🚀 Quick Start

### Step 1: Get Your Project Credentials

1. Login to your Auth System dashboard
2. Create a new project or select existing one
3. Copy your **API Key** and **API Secret** from the project dashboard
4. Configure **Allowed Domains** and **Allowed Origins** for CORS

### Step 2: Base Configuration

```javascript
const AUTH_CONFIG = {
  API_BASE_URL: 'http://localhost:5000/api/project-users',
  PROJECT_API_KEY: 'your-project-api-key-here',
  PROJECT_API_SECRET: 'your-project-api-secret-here'
};
```

---

## 🔐 Authentication Flow

### Overview
```
1. User Registration → Email Verification (optional) → Login
2. Login → Receive JWT Access Token + Refresh Token
3. Use Access Token for authenticated requests
4. Refresh token when needed
5. Logout → Invalidate tokens
```

### Token Lifecycle
- **Access Token**: Short-lived (15 minutes), use for API requests
- **Refresh Token**: Long-lived (7 days), use to get new access tokens

---

## 📚 API Endpoints

### Base Headers
```javascript
const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY,
  'Authorization': `Bearer ${accessToken}` // For authenticated requests
};
```

### 1. User Registration

**Endpoint:** `POST /api/project-users/register`

```javascript
const registerUser = async (userData) => {
  const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY
    },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username, // optional
      customFields: userData.customFields // optional
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Registration successful
    // If email verification is enabled, user needs to verify email
    console.log('User registered:', result.user);
    return result;
  } else {
    throw new Error(result.message);
  }
};

// Usage
try {
  const result = await registerUser({
    email: 'user@example.com',
    password: 'securePassword123',
    firstName: 'John',
    lastName: 'Doe'
  });
  console.log('Registration successful:', result);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### 2. User Login

**Endpoint:** `POST /api/project-users/login`

```javascript
const loginUser = async (credentials) => {
  const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Store tokens securely
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    return result;
  } else {
    throw new Error(result.message);
  }
};

// Usage
try {
  const result = await loginUser({
    email: 'user@example.com',
    password: 'securePassword123'
  });
  console.log('Login successful:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### 3. Get Current User Profile

**Endpoint:** `GET /api/project-users/profile`

```javascript
const getCurrentUser = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/profile`, {
    headers: {
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY,
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  const result = await response.json();
  
  if (result.success) {
    return result.user;
  } else {
    throw new Error(result.message);
  }
};
```

### 4. Refresh Access Token

**Endpoint:** `POST /api/project-users/refresh`

```javascript
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY
    },
    body: JSON.stringify({
      refreshToken: refreshToken
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    localStorage.setItem('accessToken', result.accessToken);
    return result.accessToken;
  } else {
    // Refresh token expired, redirect to login
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired');
  }
};
```

### 5. User Logout

**Endpoint:** `POST /api/project-users/logout`

```javascript
const logoutUser = async () => {
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    await fetch(`${AUTH_CONFIG.API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY,
        'Authorization': `Bearer ${accessToken}`
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear tokens regardless of API response
    localStorage.clear();
    window.location.href = '/login';
  }
};
```

### 6. Update User Profile

**Endpoint:** `PUT /api/project-users/profile`

```javascript
const updateUserProfile = async (updates) => {
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY,
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(updates)
  });
  
  const result = await response.json();
  
  if (result.success) {
    return result.user;
  } else {
    throw new Error(result.message);
  }
};
```

---

## 🖥️ Frontend Integration Examples

### React Authentication Hook

```javascript
// hooks/useAuth.js
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        // Token invalid, try refresh
        try {
          await refreshAccessToken();
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (refreshError) {
          // Both tokens invalid
          localStorage.clear();
        }
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const result = await loginUser(credentials);
    setUser(result.user);
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Protected Route Component

```javascript
// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

### Login Form Component

```javascript
// components/LoginForm.js
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
      // Redirect will happen automatically via AuthProvider
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          required
        />
      </div>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
```

---

## ⚙️ Backend Integration Examples

### Node.js/Express Middleware

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');
const axios = require('axios');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token with your auth system
    const response = await axios.get(`${AUTH_CONFIG.API_BASE_URL}/verify`, {
      headers: {
        'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY,
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data.success) {
      req.user = response.data.user;
      next();
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed' });
  }
};

module.exports = authMiddleware;
```

### Python/Flask Integration

```python
# auth.py
import requests
from functools import wraps
from flask import request, jsonify, current_app

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'message': 'No token provided'}), 401
        
        try:
            response = requests.get(
                f"{current_app.config['AUTH_API_URL']}/verify",
                headers={
                    'X-API-Key': current_app.config['PROJECT_API_KEY'],
                    'Authorization': f'Bearer {token}'
                }
            )
            
            if response.json().get('success'):
                request.user = response.json().get('user')
                return f(*args, **kwargs)
            else:
                return jsonify({'message': 'Invalid token'}), 401
                
        except Exception as e:
            return jsonify({'message': 'Token verification failed'}), 401
    
    return decorated_function

# Usage in routes
@app.route('/protected')
@require_auth
def protected_route():
    return jsonify({'user': request.user})
```

---

## 🛡️ Security Best Practices

### 1. Token Storage
```javascript
// ❌ Never store tokens in localStorage for sensitive apps
localStorage.setItem('accessToken', token);

// ✅ Use httpOnly cookies for production
// Set via server-side Set-Cookie header
```

### 2. API Key Security
```javascript
// ❌ Never expose API keys in frontend code
const API_KEY = 'your-secret-key';

// ✅ Use environment variables and proxy through your backend
const response = await fetch('/api/auth/login', {
  // Your backend adds the API key
});
```

### 3. HTTPS Only
```javascript
// ✅ Always use HTTPS in production
const API_BASE_URL = 'https://your-auth-system.com/api';
```

### 4. Input Validation
```javascript
// ✅ Always validate and sanitize inputs
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
```

---

## ❌ Error Handling

### Common Error Responses

```javascript
// 400 - Bad Request
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}

// 401 - Unauthorized
{
  "success": false,
  "message": "Invalid credentials"
}

// 403 - Forbidden
{
  "success": false,
  "message": "Account not verified"
}

// 429 - Rate Limited
{
  "success": false,
  "message": "Too many requests"
}

// 500 - Server Error
{
  "success": false,
  "message": "Internal server error"
}
```

### Error Handling Utility

```javascript
const handleApiError = (error, response) => {
  if (response?.status === 401) {
    // Token expired, try refresh
    return refreshAccessToken().then(() => {
      // Retry original request
      return originalRequest();
    });
  }
  
  if (response?.status === 429) {
    // Rate limited
    throw new Error('Too many requests. Please try again later.');
  }
  
  // Default error handling
  throw new Error(error.message || 'An unexpected error occurred');
};
```

---

## ⚡ Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/register` | 5 requests | 15 minutes |
| `/login` | 10 requests | 15 minutes |
| `/refresh` | 20 requests | 15 minutes |
| Other endpoints | 100 requests | 15 minutes |

### Rate Limit Headers

```javascript
// Check rate limit status
const response = await fetch('/api/endpoint');
console.log('Remaining:', response.headers.get('X-RateLimit-Remaining'));
console.log('Reset Time:', response.headers.get('X-RateLimit-Reset'));
```

---

## 🔧 Advanced Configuration

### Custom Fields Support

```javascript
// Register with custom fields
const result = await registerUser({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  customFields: {
    company: 'Acme Corp',
    role: 'Developer',
    preferences: {
      newsletter: true,
      notifications: false
    }
  }
});
```

### Email Verification Flow

```javascript
// If email verification is enabled
const verifyEmail = async (token) => {
  const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY
    },
    body: JSON.stringify({ token })
  });
  
  return await response.json();
};
```

### Password Reset Flow

```javascript
// Request password reset
const requestPasswordReset = async (email) => {
  const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY
    },
    body: JSON.stringify({ email })
  });
  
  return await response.json();
};

// Reset password with token
const resetPassword = async (token, newPassword) => {
  const response = await fetch(`${AUTH_CONFIG.API_BASE_URL}/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY
    },
    body: JSON.stringify({ token, password: newPassword })
  });
  
  return await response.json();
};
```

---

## 📞 Support

For technical support or questions:
- Check the Auth System dashboard for project status
- Review server logs for debugging
- Ensure your API keys and domains are correctly configured

---

## 🚀 Next Steps

1. **Test Integration**: Start with the login/register flow
2. **Configure Security**: Set up HTTPS and secure token storage
3. **Add Error Handling**: Implement proper error handling
4. **Monitor Usage**: Check your project dashboard for API usage
5. **Scale**: Configure rate limits and caching as needed

Happy coding! 🎉 