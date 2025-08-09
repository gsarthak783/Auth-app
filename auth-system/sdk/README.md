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

**Note:** The SDK does not automatically retry failed authentication requests (login, register, logout). Authentication errors will fail immediately to prevent rate limiting issues.

### Get Your API Keys

1. Visit the [AccessKit Dashboard](https://access-kit.vercel.app/)
2. Create an account or login
3. Create a new project
4. Copy your Project ID and API Key from the project settings

## 🔧 Core Methods

### Authentication State Management

```javascript
// Listen to auth state changes (perfect for maintaining persistent login)
const unsubscribe = auth.onAuthStateChange((user, isAuthenticated) => {
  console.log('Auth state changed:', { user, isAuthenticated });
  
  if (isAuthenticated) {
    // User is logged in
    console.log('Welcome', user.firstName);
  } else {
    // User is logged out
    console.log('User logged out');
  }
});

// Clean up listener when done
unsubscribe();

// Get current user without API call
const currentUser = auth.getCurrentUser();

// Check if authenticated
const isLoggedIn = auth.isAuthenticated();
```

The SDK automatically:
- Checks for existing tokens on initialization
- Maintains auth state across page refreshes
- Clears invalid/expired tokens
- Emits auth state changes on login/logout/profile updates

### Authentication

```javascript
// Register new user
const user = await auth.register({
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  username?: string,
  customFields?: object
});

// Login user
const { user, accessToken } = await auth.login({
  email: string,
  password: string
});

// Logout user
await auth.logout();

// Request password reset
await auth.requestPasswordReset('user@example.com');

// Reset password with token
await auth.resetPassword('reset-token', 'new-password');

// Verify email
await auth.verifyEmail('verification-token');
```

### Profile Management

```javascript
// Get current user profile
const profile = await auth.getProfile();

// Update user profile
const updatedUser = await auth.updateProfile({
  firstName: 'John',
  lastName: 'Doe',
  avatar: 'https://example.com/avatar.jpg',
  customFields: { theme: 'dark' }
});
```

### Account Security

```javascript
// Update password (requires current password)
try {
  await auth.updatePassword({
    currentPassword: 'old-password',
    newPassword: 'new-secure-password'
  });
  console.log('Password updated successfully');
  // Note: This will log out the user from all sessions
} catch (error) {
  console.error('Password update failed:', error.message);
}

// Update email (requires password verification)
try {
  const result = await auth.updateEmail({
    newEmail: 'newemail@example.com',
    password: 'current-password'
  });
  console.log('Email updated:', result.email);
  console.log('Verification required:', !result.isVerified);
} catch (error) {
  console.error('Email update failed:', error.message);
}

// Reauthenticate for sensitive operations
try {
  const result = await auth.reauthenticateWithCredential({
    password: 'current-password'
  });
  console.log('Reauthenticated at:', result.authenticatedAt);
  // Now you can perform sensitive operations
} catch (error) {
  console.error('Reauthentication failed:', error.message);
}
```

### Practical Example: Secure Account Deletion

```javascript
// Example: Implementing secure account deletion with reauthentication
async function deleteAccountSecurely(auth) {
  try {
    // Step 1: Reauthenticate the user
    console.log('Please confirm your password to continue...');
    
    const reauthResult = await auth.reauthenticateWithCredential({
      password: getUserPasswordInput() // Your UI function to get password
    });
    
    console.log('Identity verified at:', reauthResult.authenticatedAt);
    
    // Step 2: Show final confirmation
    const confirmed = await showConfirmationDialog(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (!confirmed) {
      console.log('Account deletion cancelled');
      return;
    }
    
    // Step 3: Proceed with account deletion
    // Note: You would need to implement the deleteAccount method
    // await auth.deleteAccount();
    
    console.log('Account deleted successfully');
    
  } catch (error) {
    if (error.message.includes('Password is incorrect')) {
      console.error('Authentication failed. Please check your password.');
    } else {
      console.error('Error:', error.message);
    }
  }
}
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
  
  // Account Security
  updatePassword(data: ChangePasswordData): Promise<void>
  updateEmail(data: UpdateEmailData): Promise<{ email: string; isVerified: boolean }>
  reauthenticateWithCredential(data: ReauthenticateData): Promise<{ authenticated: boolean; authenticatedAt: string }>
  
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
  isActive: boolean;
  customFields?: Record<string, any>;
  createdAt: string;
  lastLogin?: string;
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

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UpdateEmailData {
  newEmail: string;
  password: string;
}

interface ReauthenticateData {
  password: string;
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

## 📝 Changelog

### Version 1.2.0
- Added `updatePassword` method for secure password changes
- Added `updateEmail` method for email updates with verification
- Added `reauthenticateWithCredential` method for sensitive operations
- Password changes now invalidate all sessions for security
- Email updates trigger re-verification process
- Added TypeScript interfaces for all new methods

### Version 1.1.0
- Added `onAuthStateChange` method for Firebase-like auth state management
- Added `getCurrentUser` method to get user without API call
- Automatic auth state persistence across page refreshes
- Auto-initialization on SDK instantiation
- Improved React SDK to use centralized auth state management
- Added `authStateChange` event for custom event handling

### Version 1.0.5
- Fixed authentication retry loop issue that was causing excessive API calls
- Updated logout method to properly send refresh token
- Removed automatic retries for authentication endpoints (login, register, logout)
- Authentication errors now fail immediately without retrying

### Version 1.0.4
- Initial stable release

---

Built with ❤️ by the AccessKit Team 