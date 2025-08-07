# @accesskit/react

> ⚛️ React SDK for AccessKit Authentication System

[![npm version](https://badge.fury.io/js/@accesskit%2Freact.svg)](https://badge.fury.io/js/@accesskit%2Freact)
[![React](https://img.shields.io/badge/React-16.8%2B-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Ready-to-use React hooks and components for AccessKit authentication. Get started in minutes!

## 🚀 Quick Start

### Installation

```bash
npm install @accesskit/react @accesskit/auth
# or
yarn add @accesskit/react @accesskit/auth
# or
pnpm add @accesskit/react @accesskit/auth
```

### Basic Setup

```tsx
import React from 'react';
import { AuthProvider } from '@accesskit/react';

function App() {
  return (
    <AuthProvider 
      apiKey="your-project-api-key"
      projectId="your-project-id"
    >
      <YourApp />
    </AuthProvider>
  );
}

export default App;
```

### Using Authentication

```tsx
import React from 'react';
import { useAuth } from '@accesskit/react';

function LoginForm() {
  const { login, register, user, loading, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({
        email: 'user@example.com',
        password: 'password123'
      });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (user) return <div>Welcome, {user.firstName}!</div>;

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

## 📖 Documentation

### AuthProvider

Wrap your app with `AuthProvider` to enable authentication throughout your component tree:

```tsx
<AuthProvider 
  apiKey="your-api-key"
  projectId="your-project-id"
  config={{
    baseUrl: 'https://your-custom-api.com', // optional
    timeout: 10000,                         // optional
  }}
>
  <App />
</AuthProvider>
```

### useAuth Hook

The main hook for authentication operations:

```tsx
const {
  // User state
  user,              // Current user object or null
  loading,           // Loading state boolean
  error,             // Error message string or null
  isAuthenticated,   // Authentication status boolean

  // Authentication methods
  login,             // Login function
  register,          // Register function
  logout,            // Logout function
  
  // Profile methods
  updateProfile,     // Update user profile function
  refreshToken,      // Manually refresh token function
  
  // Password methods
  requestPasswordReset,  // Request password reset
  resetPassword,         // Reset password with token
  
  // Admin methods (if user has admin access)
  getUsers,          // Get all users
  updateUserStatus,  // Update user status
  deleteUser,        // Delete user
} = useAuth();
```

### Authentication Methods

#### Login
```tsx
const { login } = useAuth();

// Email login
await login({
  email: 'user@example.com',
  password: 'password123'
});

// Username login
await login({
  username: 'johndoe',
  password: 'password123'
});
```

#### Register
```tsx
const { register } = useAuth();

await register({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe'  // optional
});
```

#### Logout
```tsx
const { logout } = useAuth();

await logout();
```

### Profile Management

#### Update Profile
```tsx
const { updateProfile } = useAuth();

await updateProfile({
  firstName: 'Jane',
  lastName: 'Smith',
  bio: 'Software Developer'
});
```

#### Password Reset
```tsx
const { requestPasswordReset, resetPassword } = useAuth();

// Request reset email
await requestPasswordReset('user@example.com');

// Reset with token (from email)
await resetPassword('reset-token', 'newpassword123');
```

## 🎯 Ready-to-Use Components

### LoginForm Component

```tsx
import { LoginForm } from '@accesskit/react';

function App() {
  return (
    <LoginForm
      onSuccess={(user) => console.log('Logged in:', user)}
      onError={(error) => console.error('Login error:', error)}
      className="custom-login-form"
      showRegisterLink={true}
    />
  );
}
```

### ProtectedRoute Component

```tsx
import { ProtectedRoute } from '@accesskit/react';

function App() {
  return (
    <ProtectedRoute 
      fallback={<LoginPage />}
      requiredRole="admin" // optional
    >
      <Dashboard />
    </ProtectedRoute>
  );
}
```

### UserProfile Component

```tsx
import { UserProfile } from '@accesskit/react';

function ProfilePage() {
  return (
    <UserProfile
      editable={true}
      onUpdate={(user) => console.log('Profile updated:', user)}
      fields={['firstName', 'lastName', 'email', 'bio']}
    />
  );
}
```

## 🔧 Advanced Usage

### Custom Auth Context

```tsx
import { useAuth, AuthContext } from '@accesskit/react';

function CustomAuthProvider({ children }) {
  const auth = useAuth();
  
  // Add custom logic here
  const customAuth = {
    ...auth,
    customMethod: () => {
      // Your custom authentication logic
    }
  };

  return (
    <AuthContext.Provider value={customAuth}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Error Handling

```tsx
function MyComponent() {
  const { login, error } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
    } catch (err) {
      // Error is also available in the error state
      console.error('Login failed:', err.message);
    }
  };

  return (
    <div>
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}
      {/* Your login form */}
    </div>
  );
}
```

### Loading States

```tsx
function MyComponent() {
  const { loading, login } = useAuth();

  return (
    <div>
      <button 
        onClick={() => login(credentials)}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </div>
  );
}
```

## 🎨 Styling

All components are unstyled by default, giving you full control over the appearance:

```tsx
// Custom styled login form
<LoginForm
  className="my-login-form"
  inputClassName="my-input"
  buttonClassName="my-button"
  errorClassName="my-error"
/>
```

```css
.my-login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.my-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.my-button {
  width: 100%;
  padding: 0.75rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.my-error {
  color: #dc3545;
  margin-bottom: 1rem;
}
```

## 🔒 Security Best Practices

### Route Protection

```tsx
import { ProtectedRoute, useAuth } from '@accesskit/react';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Admin only routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
```

### Automatic Token Refresh

Tokens are automatically refreshed when they expire:

```tsx
function App() {
  const { user, refreshToken } = useAuth();

  // Tokens are refreshed automatically, but you can also trigger manually
  const handleManualRefresh = async () => {
    try {
      await refreshToken();
    } catch (error) {
      // Handle refresh failure (user will be logged out)
    }
  };

  return <div>{/* Your app */}</div>;
}
```

## 🚀 Examples

### Complete Authentication Flow

```tsx
import React, { useState } from 'react';
import { useAuth } from '@accesskit/react';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password'),
      ...(isLogin ? {} : {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName')
      })
    };

    try {
      if (isLogin) {
        await login(credentials);
      } else {
        await register(credentials);
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      {!isLogin && (
        <>
          <input name="firstName" placeholder="First Name" required />
          <input name="lastName" placeholder="Last Name" required />
        </>
      )}
      
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
      </button>
      
      <button type="button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </form>
  );
}
```

## 🤝 Support

- **GitHub**: [Issues & Feature Requests](https://github.com/gsarthak783/Auth-app/issues)
- **Documentation**: [API Docs](https://access-kit-server.vercel.app)
- **Core SDK**: [@accesskit/auth](https://npmjs.com/package/@accesskit/auth)

## 📄 License

MIT © AccessKit Team

---

**Made with ❤️ by the AccessKit Team** 