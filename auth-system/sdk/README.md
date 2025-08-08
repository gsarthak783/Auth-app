# @gsarthak783/accesskit-auth

JavaScript/TypeScript SDK for AccessKit Authentication System - Easy auth integration for any project.

[![npm version](https://badge.fury.io/js/@gsarthak783%2Faccesskit-auth.svg)](https://badge.fury.io/js/@gsarthak783%2Faccesskit-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Installation

```bash
npm install @gsarthak783/accesskit-auth
```

### Basic Usage

```javascript
import { AuthClient } from '@gsarthak783/accesskit-auth';

// Initialize the client
const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key',
  // baseUrl is automatically set to https://access-kit-server.vercel.app/api/project-users
});

// Register a new user
const user = await auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe'
});

// Login
const loginResponse = await auth.login({
  email: 'user@example.com',
  password: 'securepassword'
});

// Check if user is authenticated
if (auth.isAuthenticated()) {
  const profile = await auth.getProfile();
  console.log('User profile:', profile);
}
```

## 📖 Configuration

### AuthConfig Options

```typescript
interface AuthConfig {
  projectId: string;           // Your project ID from AccessKit dashboard
  apiKey: string;              // Your project API key
  baseUrl?: string;            // API base URL (defaults to live server)
  timeout?: number;            // Request timeout (default: 10000ms)
}
```

### Get Your API Keys

1. Visit the [AccessKit Dashboard](https://access-kit.vercel.app/)
2. Create an account or login
3. Create a new project
4. Copy your Project ID and API Key from the project settings

## 🔧 Core Methods

### Authentication

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

// Logout
await auth.logout();

// Check authentication status
const isLoggedIn = auth.isAuthenticated();
```

### User Management

```javascript
// Get user profile
const profile = await auth.getProfile();

// Update profile
const updatedUser = await auth.updateProfile({
  firstName: 'Updated Name',
  customFields: { role: 'admin' }
});

// Request password reset
await auth.requestPasswordReset('user@example.com');

// Reset password with token
await auth.resetPassword('reset-token', 'newpassword');

// Verify email with token
await auth.verifyEmail('verification-token');
```

### Token Management

```javascript
// Get current access token
const token = auth.getAccessToken();

// Refresh access token
const newToken = await auth.refreshAccessToken();

// Tokens are automatically managed by the SDK
```

## 🔐 Admin Functions

### User Administration (Requires API Key)

```javascript
// Get all users (admin only)
const users = await auth.getAllUsers({
  page: 1,
  limit: 50,
  search: 'john@example.com',
  status: 'active'
});

// Delete user (admin only)
await auth.deleteUser('user-id');

// Update user status (admin only)
await auth.updateUserStatus('user-id', 'suspended');

// Get user statistics
const stats = await auth.getStats();
```

## 🎯 Advanced Usage

### Custom Storage

```javascript
import { AuthClient, TokenStorage } from '@gsarthak783/accesskit-auth';

// Custom token storage implementation
class CustomStorage implements TokenStorage {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }
  
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}

const auth = new AuthClient(config, new CustomStorage());
```

### Event Handling

```javascript
// Listen to authentication events
auth.on('login', (data) => {
  console.log('User logged in:', data.user);
});

auth.on('logout', () => {
  console.log('User logged out');
});

auth.on('token_refresh', (data) => {
  console.log('Token refreshed:', data.accessToken);
});

auth.on('error', (error) => {
  console.error('Auth error:', error);
});
```

### Error Handling

```javascript
try {
  await auth.login({ email: 'invalid', password: 'wrong' });
} catch (error) {
  if (error.response?.status === 401) {
    console.log('Invalid credentials');
  } else if (error.response?.status === 429) {
    console.log('Too many attempts, try again later');
  } else {
    console.log('Login failed:', error.message);
  }
}
```

## 🌐 Framework Integration

### Node.js/Express

```javascript
const express = require('express');
const { AuthClient } = require('@gsarthak783/accesskit-auth');

const app = express();
const auth = new AuthClient({ projectId: 'xxx', apiKey: 'xxx' });

app.post('/api/register', async (req, res) => {
  try {
    const user = await auth.register(req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

### Next.js

```javascript
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

## 📋 API Reference

### AuthClient Class

```typescript
class AuthClient {
  constructor(config: AuthConfig, storage?: TokenStorage)
  
  // Authentication
  register(userData: CreateUserData): Promise<AuthResponse>
  login(credentials: LoginCredentials): Promise<AuthResponse>
  logout(): Promise<void>
  isAuthenticated(): boolean
  
  // User Management
  getProfile(): Promise<User>
  updateProfile(userData: UpdateUserData): Promise<User>
  requestPasswordReset(email: string): Promise<void>
  resetPassword(token: string, password: string): Promise<void>
  verifyEmail(token: string): Promise<void>
  
  // Token Management
  getAccessToken(): string | null
  refreshAccessToken(): Promise<string>
  
  // Admin Functions
  getAllUsers(options?: GetUsersOptions): Promise<ApiResponse<User[]>>
  deleteUser(userId: string): Promise<void>
  updateUserStatus(userId: string, status: string): Promise<void>
  getStats(): Promise<ApiResponse<object>>
  
  // Events
  on(event: string, callback: Function): void
  off(event: string, callback: Function): void
}
```

### Type Definitions

```typescript
interface User {
  id: string;
  email: string;
  username?: string;
  firstName: string;
  lastName?: string;
  isVerified: boolean;
  status: 'active' | 'suspended' | 'pending';
  customFields?: object;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  username?: string;
  customFields?: object;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
```

## 🛠️ Development

### Environment Variables

```bash
# For testing
AUTH_PROJECT_ID=your-test-project-id
AUTH_API_KEY=your-test-api-key
AUTH_BASE_URL=https://access-kit-server.vercel.app/api/project-users
```


## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check your API key and project ID
2. **403 Forbidden**: Ensure your project allows user registration
3. **429 Too Many Requests**: Implement rate limiting in your app
4. **Network errors**: Verify the base URL and internet connection

### Debug Mode

```javascript
const auth = new AuthClient({
  projectId: 'xxx',
  apiKey: 'xxx',
  debug: true  // Enable debug logging
});
```

## 📞 Support

- **Documentation**: [https://access-kit.vercel.app/](https://access-kit.vercel.app/)
- **npm Package**: [https://npmjs.com/package/@gsarthak783/accesskit-auth](https://npmjs.com/package/@gsarthak783/accesskit-auth)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

Built with ❤️ by the AccessKit Team 