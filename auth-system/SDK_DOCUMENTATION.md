# 🚀 Your Auth System SDK Documentation

Complete documentation for integrating Your Auth System using our JavaScript and React SDKs.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [JavaScript SDK](#javascript-sdk)
3. [React SDK](#react-sdk)
4. [API Reference](#api-reference)
5. [Advanced Usage](#advanced-usage)
6. [Deployment Guide](#deployment-guide)
7. [Examples](#examples)

---

## 🚀 Quick Start

### Installation

```bash
# For vanilla JavaScript/Node.js projects
npm install @your-auth/sdk

# For React projects (includes the base SDK)
npm install @your-auth/react

# Or with yarn
yarn add @your-auth/sdk
yarn add @your-auth/react
```

### Basic Setup

```javascript
import { AuthClient } from '@your-auth/sdk';

const authClient = new AuthClient({
  apiKey: 'your-project-api-key',
  baseUrl: 'https://your-auth-service.com/api/project-users'
});

// Login a user
const user = await authClient.login({
  email: 'user@example.com',
  password: 'password123'
});

console.log('Logged in user:', user);
```

---

## 📚 JavaScript SDK

### Configuration

```javascript
import { AuthClient, LocalTokenStorage } from '@your-auth/sdk';

const authClient = new AuthClient({
  apiKey: 'your-project-api-key',
  baseUrl: 'https://your-auth-service.com/api/project-users',
  timeout: 10000,
  retryAttempts: 3
}, new LocalTokenStorage());
```

### Authentication Methods

#### Register User
```javascript
const user = await authClient.register({
  email: 'user@example.com',
  password: 'securePassword123',
  firstName: 'John',
  lastName: 'Doe',
  customFields: {
    company: 'Acme Corp',
    role: 'Developer'
  }
});
```

#### Login User
```javascript
const response = await authClient.login({
  email: 'user@example.com',
  password: 'securePassword123'
});

console.log('User:', response.user);
console.log('Access Token:', response.accessToken);
```

#### Get User Profile
```javascript
const user = await authClient.getProfile();
console.log('Current user:', user);
```

#### Update Profile
```javascript
const updatedUser = await authClient.updateProfile({
  firstName: 'Jane',
  customFields: {
    company: 'New Company'
  }
});
```

#### Logout
```javascript
await authClient.logout();
```

### Event System

```javascript
// Listen for authentication events
authClient.on('login', (data) => {
  console.log('User logged in:', data.user);
});

authClient.on('logout', () => {
  console.log('User logged out');
});

authClient.on('error', (data) => {
  console.error('Auth error:', data.error);
});

authClient.on('token_refresh', () => {
  console.log('Token refreshed');
});
```

### Token Storage Options

#### localStorage (Default)
```javascript
import { LocalTokenStorage } from '@your-auth/sdk';

const storage = new LocalTokenStorage('myapp'); // Optional prefix
const authClient = new AuthClient(config, storage);
```

#### Memory Storage (SSR-friendly)
```javascript
import { MemoryTokenStorage } from '@your-auth/sdk';

const storage = new MemoryTokenStorage();
const authClient = new AuthClient(config, storage);
```

#### Cookie Storage
```javascript
import { CookieTokenStorage } from '@your-auth/sdk';

const storage = new CookieTokenStorage('myapp');
const authClient = new AuthClient(config, storage);
```

### Admin Functions

#### Export Users
```javascript
const exportData = await authClient.exportUsers({
  format: 'json', // or 'csv'
  includeCustomFields: true,
  dateRange: {
    from: '2024-01-01',
    to: '2024-12-31'
  }
});

console.log('Exported users:', exportData.users);
```

#### Import Users
```javascript
const importResult = await authClient.importUsers(exportData, {
  updateExisting: true,
  skipInvalid: false
});

console.log('Import results:', importResult.results);
```

#### Get All Users (with pagination)
```javascript
const usersResponse = await authClient.getUsers({
  page: 1,
  limit: 50
});

console.log('Users:', usersResponse.data);
console.log('Pagination:', usersResponse.pagination);
```

---

## ⚛️ React SDK

### Setup

```jsx
import React from 'react';
import { AuthProvider } from '@your-auth/react';
import { LocalTokenStorage } from '@your-auth/sdk';

function App() {
  return (
    <AuthProvider
      config={{
        apiKey: 'your-project-api-key',
        baseUrl: 'https://your-auth-service.com/api/project-users'
      }}
      storage={new LocalTokenStorage()}
      autoInitialize={true}
    >
      <AppContent />
    </AuthProvider>
  );
}
```

### useAuth Hook

```jsx
import React from 'react';
import { useAuth } from '@your-auth/react';

function LoginPage() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    login, 
    logout, 
    register 
  } = useAuth();

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // User automatically updated in context
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome, {user.firstName}!</h1>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      {/* Your login form */}
      <button onClick={() => handleLogin('user@example.com', 'password')}>
        Login
      </button>
    </div>
  );
}
```

### Ready-to-Use Components

#### LoginForm Component
```jsx
import { LoginForm } from '@your-auth/react';

function LoginPage() {
  return (
    <div className="login-page">
      <LoginForm
        onSuccess={() => {
          console.log('Login successful!');
          // Redirect or update UI
        }}
        onError={(error) => {
          console.error('Login failed:', error);
        }}
        showSignupLink={true}
        onSignupClick={() => {
          // Navigate to signup page
        }}
      />
    </div>
  );
}
```

### Protected Routes

```jsx
import { useAuth } from '@your-auth/react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## 📖 API Reference

### AuthClient Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `register(userData)` | Register new user | `CreateUserData` | `Promise<AuthResponse>` |
| `login(credentials)` | Login user | `LoginCredentials` | `Promise<AuthResponse>` |
| `logout()` | Logout user | - | `Promise<void>` |
| `getProfile()` | Get current user | - | `Promise<User>` |
| `updateProfile(data)` | Update user profile | `UpdateUserData` | `Promise<User>` |
| `refreshToken()` | Refresh access token | - | `Promise<string>` |
| `requestPasswordReset(email)` | Request password reset | `string` | `Promise<void>` |
| `resetPassword(token, password)` | Reset password | `string, string` | `Promise<void>` |
| `verifyEmail(token)` | Verify email | `string` | `Promise<void>` |
| `isAuthenticated()` | Check auth status | - | `boolean` |
| `exportUsers(options)` | Export users (admin) | `ExportOptions` | `Promise<ExportData>` |
| `importUsers(data, options)` | Import users (admin) | `ExportData, ImportOptions` | `Promise<ApiResponse>` |
| `getUsers(options)` | Get all users (admin) | `PaginationOptions` | `Promise<PaginatedResponse<User>>` |

### TypeScript Types

```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  customFields?: Record<string, any>;
  createdAt: string;
  lastLogin?: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  customFields?: Record<string, any>;
}
```

---

## 🔧 Advanced Usage

### Custom Token Storage

```javascript
import { TokenStorage } from '@your-auth/sdk';

class CustomTokenStorage implements TokenStorage {
  getAccessToken(): string | null {
    // Your custom logic
    return localStorage.getItem('custom_access_token');
  }

  setAccessToken(token: string): void {
    localStorage.setItem('custom_access_token', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('custom_refresh_token');
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('custom_refresh_token', token);
  }

  clearTokens(): void {
    localStorage.removeItem('custom_access_token');
    localStorage.removeItem('custom_refresh_token');
  }
}

const authClient = new AuthClient(config, new CustomTokenStorage());
```

### Request Interceptors

```javascript
// Access the underlying axios instance
const httpClient = authClient.http;

// Add custom request interceptor
httpClient.interceptors.request.use((config) => {
  config.headers['Custom-Header'] = 'value';
  return config;
});
```

### Error Handling

```javascript
authClient.on('error', (data) => {
  if (data.error.message.includes('network')) {
    // Handle network errors
    showNetworkErrorModal();
  } else if (data.error.message.includes('401')) {
    // Handle authentication errors
    redirectToLogin();
  }
});
```

---

## 🚀 Deployment Guide

### 1. Deploy Your Auth Service

#### Option A: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option B: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option C: Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t your-auth-service .
docker run -p 5000:5000 your-auth-service
```

### 2. Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=5000
MONGODB_URI=your-production-mongodb-uri
JWT_ACCESS_SECRET=your-secure-jwt-secret
JWT_REFRESH_SECRET=your-secure-refresh-secret
EMAIL_HOST=smtp.your-provider.com
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-email-password
CLIENT_URL=https://your-frontend-domain.com
```

### 3. Configure CORS

```javascript
// In your deployed service
const allowedOrigins = [
  'https://your-frontend-domain.com',
  'https://your-app.vercel.app',
  'http://localhost:3000' // For development
];
```

### 4. Publish SDKs to NPM

```bash
# Build the SDK
cd auth-system/sdk
npm run build

# Publish to NPM
npm publish --access public

# Build and publish React SDK
cd ../sdk-react
npm run build
npm publish --access public
```

### 5. Update SDK Configuration

```javascript
// In your apps, use the production URL
const authClient = new AuthClient({
  apiKey: 'your-project-api-key',
  baseUrl: 'https://your-auth-service.railway.app/api/project-users'
});
```

---

## 💡 Examples

### Example 1: Next.js App

```jsx
// pages/_app.js
import { AuthProvider } from '@your-auth/react';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_AUTH_API_KEY,
        baseUrl: process.env.NEXT_PUBLIC_AUTH_BASE_URL
      }}
    >
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// pages/dashboard.js
import { useAuth } from '@your-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Welcome to your dashboard, {user.firstName}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

### Example 2: Express.js Backend Integration

```javascript
// middleware/auth.js
import { AuthClient } from '@your-auth/sdk';

const authClient = new AuthClient({
  apiKey: process.env.AUTH_API_KEY,
  baseUrl: process.env.AUTH_BASE_URL
});

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token with auth service
    authClient.storage.setAccessToken(token);
    const user = await authClient.getProfile();
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// routes/api.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/protected', requireAuth, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user
  });
});

export default router;
```

### Example 3: Vue.js Integration

```javascript
// main.js
import { createApp } from 'vue';
import { AuthClient } from '@your-auth/sdk';
import App from './App.vue';

const authClient = new AuthClient({
  apiKey: import.meta.env.VITE_AUTH_API_KEY,
  baseUrl: import.meta.env.VITE_AUTH_BASE_URL
});

const app = createApp(App);

// Make auth client available globally
app.config.globalProperties.$auth = authClient;
app.provide('auth', authClient);

app.mount('#app');
```

```vue
<!-- Login.vue -->
<template>
  <form @submit.prevent="login">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>

<script>
import { inject, ref } from 'vue';

export default {
  setup() {
    const auth = inject('auth');
    const email = ref('');
    const password = ref('');
    const loading = ref(false);

    const login = async () => {
      loading.value = true;
      try {
        await auth.login({
          email: email.value,
          password: password.value
        });
        // Redirect to dashboard
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        loading.value = false;
      }
    };

    return { email, password, loading, login };
  }
};
</script>
```

---

## 🛡️ Security Best Practices

### 1. API Key Security
```javascript
// ❌ Never expose API keys in frontend
const API_KEY = 'your-secret-key';

// ✅ Use environment variables
const API_KEY = process.env.REACT_APP_AUTH_API_KEY;

// ✅ Even better - proxy through your backend
const response = await fetch('/api/auth/login', {
  // Your backend adds the API key
});
```

### 2. Token Storage
```javascript
// ✅ For production apps, use httpOnly cookies
import { CookieTokenStorage } from '@your-auth/sdk';

const storage = new CookieTokenStorage();
const authClient = new AuthClient(config, storage);
```

### 3. HTTPS Only
```javascript
// ✅ Always use HTTPS in production
const authClient = new AuthClient({
  apiKey: 'your-key',
  baseUrl: 'https://your-auth-service.com/api/project-users' // HTTPS
});
```

---

## 📞 Support & Resources

- **Dashboard**: Manage your projects at your auth service dashboard
- **API Documentation**: Complete API reference in your project guide
- **GitHub**: Report issues and contribute
- **Community**: Join our Discord/Slack for support

---

## 🎉 What's Next?

1. **Deploy Your Service**: Follow the deployment guide
2. **Integrate SDK**: Use our JavaScript or React SDK
3. **Customize**: Add custom fields, styling, and logic
4. **Scale**: Monitor usage and upgrade as needed
5. **Contribute**: Help improve the SDKs and documentation

Happy coding! 🚀 