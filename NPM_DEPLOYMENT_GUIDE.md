# 📦 AccessKit NPM Packages - Deployment Guide

## 🎉 Published Packages

The AccessKit authentication system is now available as npm packages for easy integration into any project!

### 📋 Published Packages

| Package | Version | Description | Install |
|---------|---------|-------------|---------|
| **[@gsarthak783/accesskit-auth](https://npmjs.com/package/@gsarthak783/accesskit-auth)** | v1.0.0 | Core JavaScript/TypeScript SDK | `npm install @gsarthak783/accesskit-auth` |
| **[@gsarthak783/accesskit-react](https://npmjs.com/package/@gsarthak783/accesskit-react)** | v1.0.0 | React hooks and components | `npm install @gsarthak783/accesskit-react` |

## 🚀 Quick Start

### Option 1: JavaScript/TypeScript Projects

```bash
npm install @gsarthak783/accesskit-auth
```

```javascript
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});

// Register user
const user = await auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe'
});

// Login user
const response = await auth.login({
  email: 'user@example.com',
  password: 'securepassword'
});
```

### Option 2: React Projects

```bash
npm install @gsarthak783/accesskit-react
```

```jsx
import { AuthProvider, useAuth } from '@gsarthak783/accesskit-react';

function App() {
  return (
    <AuthProvider config={{ projectId: 'your-project-id', apiKey: 'your-api-key' }}>
      <MyComponent />
    </AuthProvider>
  );
}

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={() => login('email@example.com', 'password')}>Login</button>;
  }
  
  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔑 Getting API Keys

### Step 1: Create Account
1. Visit [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Project
1. Click "Create New Project" in your dashboard
2. Enter your project name and description
3. Configure your project settings:
   - **Allow Signup**: Enable user registration
   - **Email Verification**: Optional email verification
   - **Password Requirements**: Set minimum length
   - **CORS Origins**: Add your domains

### Step 3: Get Credentials
1. Navigate to your project settings
2. Copy your **Project ID** and **API Key**
3. Configure allowed origins for CORS

### Step 4: Configure Environment
```bash
# For frontend applications
REACT_APP_AUTH_PROJECT_ID=your-project-id

# For backend applications
AUTH_PROJECT_ID=your-project-id
AUTH_API_KEY=your-api-key
AUTH_BASE_URL=https://access-kit-server.vercel.app/api/project-users
```

## 📖 Package Documentation

### Core SDK Features (@gsarthak783/accesskit-auth)

#### Authentication Methods
```javascript
// Register new user
const user = await auth.register({
  email: string,
  password: string,
  firstName: string,
  lastName?: string,
  username?: string,
  customFields?: object
});

// Login user
const response = await auth.login({
  email: string,
  password: string
});

// Logout user
await auth.logout();

// Check authentication status
const isLoggedIn = auth.isAuthenticated();
```

#### Profile Management
```javascript
// Get user profile
const profile = await auth.getProfile();

// Update profile
const updatedUser = await auth.updateProfile({
  firstName: 'New Name',
  customFields: { role: 'admin' }
});

// Request password reset
await auth.requestPasswordReset('user@example.com');

// Reset password with token
await auth.resetPassword('reset-token', 'newpassword');

// Verify email
await auth.verifyEmail('verification-token');
```

#### Admin Functions (Requires API Key)
```javascript
// Get all users
const users = await auth.getAllUsers({
  page: 1,
  limit: 50,
  search: 'john@example.com',
  status: 'active'
});

// Delete user
await auth.deleteUser('user-id');

// Update user status
await auth.updateUserStatus('user-id', 'suspended');

// Get statistics
const stats = await auth.getStats();
```

### React SDK Features (@gsarthak783/accesskit-react)

#### useAuth Hook
```jsx
const {
  // State
  user,                    // Current user object or null
  isLoading,              // Loading state boolean
  isAuthenticated,        // Authentication status boolean
  
  // Actions
  login,                  // (email, password) => Promise<void>
  register,               // (userData) => Promise<void>
  logout,                 // () => Promise<void>
  updateProfile,          // (userData) => Promise<void>
  requestPasswordReset,   // (email) => Promise<void>
  resetPassword,          // (token, password) => Promise<void>
  verifyEmail,            // (token) => Promise<void>
  
  // Direct SDK access
  client                  // AuthClient instance
} = useAuth();
```

#### Ready-to-Use Components
```jsx
import { LoginForm } from '@gsarthak783/accesskit-react';

<LoginForm
  onSuccess={() => console.log('Login successful!')}
  onError={(error) => console.error('Login failed:', error)}
  className="custom-login-form"
  buttonText="Sign In"
  showSignupLink={true}
  onSignupClick={() => navigate('/signup')}
/>
```

## 🌐 Integration Examples

### Next.js Integration
```javascript
// pages/_app.js
import { AuthProvider } from '@gsarthak783/accesskit-react';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider config={{ projectId: 'xxx', apiKey: 'xxx' }}>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// pages/api/auth/register.js
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: process.env.AUTH_PROJECT_ID,
  apiKey: process.env.AUTH_API_KEY
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const user = await auth.register(req.body);
      res.status(200).json({ user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

### Vue.js Integration
```javascript
// main.js
import { createApp } from 'vue';
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});

const app = createApp(App);
app.config.globalProperties.$auth = auth;
app.mount('#app');
```

### Angular Integration
```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { AuthClient } from '@gsarthak783/accesskit-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = new AuthClient({
    projectId: 'your-project-id',
    apiKey: 'your-api-key'
  });

  async login(email: string, password: string) {
    return this.auth.login({ email, password });
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }
}
```

### Express.js Backend
```javascript
const express = require('express');
const { AuthClient } = require('@gsarthak783/accesskit-auth');

const app = express();
const auth = new AuthClient({
  projectId: process.env.AUTH_PROJECT_ID,
  apiKey: process.env.AUTH_API_KEY
});

app.post('/api/register', async (req, res) => {
  try {
    const user = await auth.register(req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

## 🔒 Security Best Practices

### Environment Variables
```bash
# ❌ Don't expose API keys in frontend
const config = {
  projectId: 'proj_123',
  apiKey: 'sk_live_abc123' // Never expose secret keys in frontend!
};

# ✅ Use environment variables
const config = {
  projectId: process.env.REACT_APP_PROJECT_ID,
  // API keys should only be used server-side
};
```

### Secure Token Storage
```javascript
// For React Native or secure environments
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: async (key) => await SecureStore.getItemAsync(key),
  setItem: async (key, value) => await SecureStore.setItemAsync(key, value),
  removeItem: async (key) => await SecureStore.deleteItemAsync(key)
};

const auth = new AuthClient(config, secureStorage);
```

### Input Validation
```javascript
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password);
};
```

## 🧪 Testing

### Testing with Jest
```javascript
// auth.test.js
import { AuthClient } from '@gsarthak783/accesskit-auth';

describe('AuthClient', () => {
  let auth;

  beforeEach(() => {
    auth = new AuthClient({
      projectId: 'test-project-id',
      apiKey: 'test-api-key'
    });
  });

  test('should register user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'testpass123',
      firstName: 'Test',
      lastName: 'User'
    };

    const user = await auth.register(userData);
    expect(user.email).toBe(userData.email);
  });
});
```

### Testing React Components
```jsx
// LoginComponent.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthProvider } from '@gsarthak783/accesskit-react';
import LoginComponent from './LoginComponent';

test('renders login form', () => {
  render(
    <AuthProvider config={{ projectId: 'test', apiKey: 'test' }}>
      <LoginComponent />
    </AuthProvider>
  );

  expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
});
```

## 🚨 Error Handling

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user/resource not found)
- `409` - Conflict (email already exists)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Handling Examples
```javascript
try {
  await auth.register(userData);
} catch (error) {
  if (error.response?.status === 409) {
    console.log('Email already exists');
  } else if (error.response?.status === 400) {
    console.log('Validation error:', error.response.data.errors);
  } else {
    console.log('Registration failed:', error.message);
  }
}
```

## 📊 Monitoring & Analytics

### Usage Analytics
- **Dashboard**: View user statistics in your project dashboard
- **API Calls**: Monitor API usage and rate limits
- **User Activity**: Track registrations, logins, and activity
- **Error Rates**: Monitor error rates and response times

### Performance Monitoring
```javascript
// Track authentication performance
const startTime = Date.now();
await auth.login(credentials);
const duration = Date.now() - startTime;
console.log(`Login took ${duration}ms`);
```

## 🔄 Version Management

### Semantic Versioning
We follow semantic versioning (semver) for our packages:
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality
- **PATCH** version for backwards-compatible bug fixes

### Updating Packages
```bash
# Check for updates
npm outdated @gsarthak783/accesskit-auth @gsarthak783/accesskit-react

# Update to latest version
npm update @gsarthak783/accesskit-auth @gsarthak783/accesskit-react

# Install specific version
npm install @gsarthak783/accesskit-auth@1.0.0
```

### Migration Guides
- **v1.0.0**: Initial release
- Future versions will include migration guides

## 🛠️ Troubleshooting

### Common Issues

#### 1. CORS Errors
**Problem**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution**: Add your domain to allowed origins in your project dashboard
```javascript
// Allowed origins should include:
// http://localhost:3000 (for development)
// https://yourapp.com (for production)
```

#### 2. 401 Unauthorized
**Problem**: API returns 401 Unauthorized

**Solution**: Check your API key and project ID
```javascript
// Verify your credentials
const auth = new AuthClient({
  projectId: 'your-correct-project-id',
  apiKey: 'your-correct-api-key'
});
```

#### 3. Rate Limiting
**Problem**: Too many requests error (429)

**Solution**: Implement proper error handling and retry logic
```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function retryRequest(fn, retries = 3) {
  try {
    return await fn();
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      await delay(1000); // Wait 1 second
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
}
```

#### 4. Token Expiration
**Problem**: Access token expired

**Solution**: Tokens are automatically refreshed by the SDK
```javascript
// The SDK automatically handles token refresh
// But you can also manually refresh if needed
try {
  const newToken = await auth.refreshAccessToken();
} catch (error) {
  // Refresh failed, user needs to log in again
  await auth.logout();
}
```

## 📞 Support

### Getting Help
1. **Documentation**: Check our [complete documentation](https://access-kit-server.vercel.app)
2. **GitHub Issues**: [Report bugs or request features](https://github.com/gsarthak783/Auth-app/issues)
3. **Community**: Join our Discord for community support

### Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Links
- **🌐 Live API**: [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app)
- **📦 Core SDK**: [https://npmjs.com/package/@gsarthak783/accesskit-auth](https://npmjs.com/package/@gsarthak783/accesskit-auth)
- **⚛️ React SDK**: [https://npmjs.com/package/@gsarthak783/accesskit-react](https://npmjs.com/package/@gsarthak783/accesskit-react)
- **🐙 GitHub**: [https://github.com/gsarthak783/Auth-app](https://github.com/gsarthak783/Auth-app)

---

**Built with ❤️ by the AccessKit Team**

*Making authentication simple, secure, and scalable for developers worldwide.* 