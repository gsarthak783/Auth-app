# @accesskit/auth

> 🔐 JavaScript/TypeScript SDK for AccessKit Authentication System

[![npm version](https://badge.fury.io/js/@accesskit%2Fauth.svg)](https://badge.fury.io/js/@accesskit%2Fauth)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Easy authentication integration for any JavaScript/TypeScript project. Works with vanilla JS, React, Vue, Angular, and more!

## 🚀 Quick Start

### Installation

```bash
npm install @accesskit/auth
# or
yarn add @accesskit/auth
# or
pnpm add @accesskit/auth
```

### Basic Usage

```typescript
import { AuthClient } from '@accesskit/auth';

// Initialize the client
const auth = new AuthClient({
  apiKey: 'your-project-api-key',
  projectId: 'your-project-id'
});

// Register a new user
try {
  const result = await auth.register({
    email: 'user@example.com',
    password: 'securepassword',
    firstName: 'John',
    lastName: 'Doe'
  });
  console.log('User registered:', result.user);
} catch (error) {
  console.error('Registration failed:', error.message);
}

// Login
try {
  const result = await auth.login({
    email: 'user@example.com',
    password: 'securepassword'
  });
  console.log('Login successful:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

## 📖 Documentation

### Configuration Options

```typescript
interface AuthConfig {
  apiKey: string;           // Your project API key (required)
  projectId: string;        // Your project ID (required)
  baseUrl?: string;         // Custom API endpoint (optional)
  timeout?: number;         // Request timeout in ms (default: 10000)
  retryAttempts?: number;   // Retry failed requests (default: 3)
}
```

### Authentication Methods

#### Register
```typescript
await auth.register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',      // optional
  customFields: {}          // optional custom data
});
```

#### Login
```typescript
// Login with email
await auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Login with username
await auth.login({
  username: 'johndoe',
  password: 'password123'
});
```

#### Logout
```typescript
await auth.logout();
```

### User Management

#### Get User Profile
```typescript
const user = await auth.getProfile();
console.log(user.email, user.firstName);
```

#### Update Profile
```typescript
const updatedUser = await auth.updateProfile({
  firstName: 'Jane',
  bio: 'Software developer'
});
```

#### Password Reset
```typescript
// Request password reset
await auth.requestPasswordReset('user@example.com');

// Reset with token (from email)
await auth.resetPassword('reset-token', 'newpassword123');
```

### Authentication State

#### Check Authentication
```typescript
if (auth.isAuthenticated()) {
  console.log('User is logged in');
  const token = auth.getAccessToken();
}
```

#### Event Listeners
```typescript
// Listen for auth events
auth.on('login', (data) => {
  console.log('User logged in:', data.user);
});

auth.on('logout', (data) => {
  console.log('User logged out');
});

auth.on('error', (data) => {
  console.error('Auth error:', data.error);
});

auth.on('token_refresh', (data) => {
  console.log('Token refreshed');
});
```

### Admin Functions

#### Get All Users (Admin Only)
```typescript
const users = await auth.getUsers({
  page: 1,
  limit: 20,
  search: 'john'
});
```

#### Update User Status (Admin Only)
```typescript
await auth.updateUserStatus('user-id', false); // deactivate user
```

#### Export/Import Users (Admin Only)
```typescript
// Export users
const exportData = await auth.exportUsers({
  format: 'json',
  includeInactive: false
});

// Import users
await auth.importUsers(exportData);
```

## 🔧 Advanced Usage

### Custom Storage
By default, tokens are stored in localStorage. You can provide custom storage:

```typescript
import { TokenStorage } from '@accesskit/auth';

class CustomStorage implements TokenStorage {
  setAccessToken(token: string): void {
    // Your storage logic
  }
  
  getAccessToken(): string | null {
    // Your retrieval logic
  }
  
  setRefreshToken(token: string): void {
    // Your storage logic
  }
  
  getRefreshToken(): string | null {
    // Your retrieval logic
  }
  
  clearTokens(): void {
    // Your cleanup logic
  }
}

const auth = new AuthClient(config, new CustomStorage());
```

### Error Handling
```typescript
try {
  await auth.login(credentials);
} catch (error) {
  if (error.message.includes('Invalid credentials')) {
    // Handle invalid login
  } else if (error.message.includes('Account locked')) {
    // Handle locked account
  } else {
    // Handle other errors
  }
}
```

## 🌐 Framework Integration

### React
For React applications, use our dedicated React SDK:
```bash
npm install @accesskit/react
```

### Vue.js
```javascript
// In your Vue component
export default {
  async mounted() {
    this.auth = new AuthClient({ apiKey: 'your-key', projectId: 'your-id' });
    
    if (this.auth.isAuthenticated()) {
      this.user = await this.auth.getProfile();
    }
  }
}
```

### Angular
```typescript
// In your Angular service
import { Injectable } from '@angular/core';
import { AuthClient } from '@accesskit/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = new AuthClient({
    apiKey: 'your-key',
    projectId: 'your-id'
  });

  async login(email: string, password: string) {
    return this.auth.login({ email, password });
  }
}
```

## 🔑 API Reference

### Live API Endpoint
- **Base URL**: `https://access-kit-server.vercel.app`
- **Documentation**: Available in your project dashboard

### TypeScript Support
This package is written in TypeScript and includes full type definitions. No additional `@types` packages needed!

## 🤝 Support

- **GitHub**: [Issues & Feature Requests](https://github.com/gsarthak783/Auth-app/issues)
- **Documentation**: [API Docs](https://access-kit-server.vercel.app)

## 📄 License

MIT © AccessKit Team

---

**Made with ❤️ by the AccessKit Team** 