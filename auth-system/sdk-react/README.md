# @gsarthak783/accesskit-react

React SDK for AccessKit Authentication System - Ready-to-use hooks and components for React applications.

[![npm version](https://badge.fury.io/js/@gsarthak783%2Faccesskit-react.svg)](https://badge.fury.io/js/@gsarthak783%2Faccesskit-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

### Installation

```bash
npm install @gsarthak783/accesskit-react
```

> **Note**: This package automatically includes `@gsarthak783/accesskit-auth` as a dependency.

### Basic Setup

Wrap your app with the `AuthProvider`:

```jsx
import React from 'react';
import { AuthProvider } from '@gsarthak783/accesskit-react';

function App() {
  return (
    <AuthProvider 
      config={{
        projectId: 'your-project-id',
        apiKey: 'your-api-key'
        // baseUrl automatically points to https://access-kit-server.vercel.app/api/project-users
      }}
    >
      <YourApp />
    </AuthProvider>
  );
}

export default App;
```

### Using the useAuth Hook

```jsx
import { useAuth } from '@gsarthak783/accesskit-react';

function MyComponent() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    login, 
    register, 
    logout 
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => login('user@example.com', 'password')}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🎯 Get Your API Keys

1. Visit the [AccessKit Dashboard](https://access-kit.vercel.app/)
2. Create an account or login
3. Create a new project
4. Copy your Project ID and API Key from the project settings

## 🪝 useAuth Hook

The `useAuth` hook provides all authentication functionality:

```typescript
interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  
  // Direct SDK access
  client: AuthClient;
}
```

### Registration

```jsx
function SignupForm() {
  const { register, isLoading } = useAuth();
  
  const handleSubmit = async (formData) => {
    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        customFields: { role: 'user' }
      });
      // User is automatically logged in after registration
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### Profile Management

```jsx
function UserProfile() {
  const { user, updateProfile } = useAuth();

  const handleUpdate = async (newData) => {
    try {
      await updateProfile(newData);
      // User state is automatically updated
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>{user.email}</p>
      <button onClick={() => handleUpdate({ firstName: 'NewName' })}>
        Update Name
      </button>
    </div>
  );
}
```

## 🧩 Ready-to-Use Components

### LoginForm Component

A complete login form with validation:

```jsx
import { LoginForm } from '@gsarthak783/accesskit-react';

function LoginPage() {
  return (
    <div className="login-page">
      <LoginForm
        onSuccess={() => console.log('Login successful!')}
        onError={(error) => console.error('Login failed:', error)}
        className="custom-login-form"
        buttonText="Sign In"
        showSignupLink={true}
        onSignupClick={() => navigate('/signup')}
      />
    </div>
  );
}
```

### LoginForm Props

```typescript
interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  buttonText?: string;
  showSignupLink?: boolean;
  onSignupClick?: () => void;
}
```

## ⚙️ AuthProvider Configuration

```jsx
<AuthProvider 
  config={{
    projectId: 'your-project-id',
    apiKey: 'your-api-key',
    baseUrl: 'https://access-kit-server.vercel.app/api/project-users', // Optional, defaults to this
    timeout: 10000 // Optional, request timeout in ms
  }}
  storage={customStorage} // Optional, custom token storage
  autoInitialize={true}   // Optional, auto-check authentication on mount
>
  <App />
</AuthProvider>
```

### Custom Storage

```jsx
import { AuthProvider } from '@gsarthak783/accesskit-react';

// Custom storage for React Native or other environments
const customStorage = {
  getItem: (key) => AsyncStorage.getItem(key),
  setItem: (key, value) => AsyncStorage.setItem(key, value),
  removeItem: (key) => AsyncStorage.removeItem(key)
};

<AuthProvider config={config} storage={customStorage}>
  <App />
</AuthProvider>
```

## 🎨 Advanced Usage

### Protected Routes

```jsx
import { useAuth } from '@gsarthak783/accesskit-react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

// Usage
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### Role-Based Access

```jsx
function AdminPanel() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || user.customFields?.role !== 'admin') {
    return <div>Access denied</div>;
  }

  return <div>Admin content</div>;
}
```

### Form Validation

```jsx
function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email';
    }
    
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await register(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
      />
      {errors.password && <span className="error">{errors.password}</span>}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Registering...' : 'Register'}
      </button>
      
      {errors.submit && <div className="error">{errors.submit}</div>}
    </form>
  );
}
```

### Direct SDK Access

```jsx
function AdvancedComponent() {
  const { client } = useAuth();

  const handleAdminAction = async () => {
    try {
      // Direct access to the underlying AuthClient
      const users = await client.getAllUsers({
        page: 1,
        limit: 10,
        status: 'active'
      });
      console.log('Users:', users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  return (
    <button onClick={handleAdminAction}>
      Get All Users (Admin)
    </button>
  );
}
```

## 🎨 Styling

The components come with minimal styling. You can customize them using CSS classes:

```css
/* Custom styles for LoginForm */
.custom-login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.custom-login-form input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.custom-login-form button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.custom-login-form button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}
```

## 🔒 Security Best Practices

### Environment Variables

Never expose API keys in frontend code:

```javascript
// ❌ Don't do this
const config = {
  projectId: 'proj_123',
  apiKey: 'sk_live_abc123' // Never expose secret keys in frontend!
};

// ✅ Do this instead
const config = {
  projectId: process.env.REACT_APP_PROJECT_ID,
  // Use public keys only in frontend, manage auth server-side
};
```

### Secure Token Storage

```jsx
// For React Native or when you need secure storage
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: async (key) => await SecureStore.getItemAsync(key),
  setItem: async (key, value) => await SecureStore.setItemAsync(key, value),
  removeItem: async (key) => await SecureStore.deleteItemAsync(key)
};

<AuthProvider config={config} storage={secureStorage}>
  <App />
</AuthProvider>
```

### Input Validation

Always validate user inputs:

```jsx
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

## 🧪 Examples

### Complete Login/Register Flow

```jsx
import React, { useState } from 'react';
import { useAuth, LoginForm } from '@gsarthak783/accesskit-react';

function AuthFlow() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

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
      <div className="auth-tabs">
        <button 
          onClick={() => setShowLogin(true)}
          className={showLogin ? 'active' : ''}
        >
          Login
        </button>
        <button 
          onClick={() => setShowLogin(false)}
          className={!showLogin ? 'active' : ''}
        >
          Register
        </button>
      </div>

      {showLogin ? (
        <LoginForm
          onSuccess={() => console.log('Logged in!')}
          showSignupLink={true}
          onSignupClick={() => setShowLogin(false)}
        />
      ) : (
        <RegisterForm onSuccess={() => setShowLogin(true)} />
      )}
    </div>
  );
}
```

### TypeScript Support

```tsx
import { useAuth } from '@gsarthak783/accesskit-react';
import type { User } from '@gsarthak783/accesskit-auth';

interface UserProfileProps {
  onUpdate?: (user: User) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onUpdate }) => {
  const { user, updateProfile } = useAuth();

  const handleUpdate = async (data: Partial<User>) => {
    try {
      const updatedUser = await updateProfile(data);
      onUpdate?.(updatedUser);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      <h2>{user?.firstName} {user?.lastName}</h2>
      <button onClick={() => handleUpdate({ firstName: 'New Name' })}>
        Update Profile
      </button>
    </div>
  );
};
```

## 📞 Support

- **Live Demo**: [https://access-kit.vercel.app/](https://access-kit.vercel.app/)
- **npm Package**: [https://npmjs.com/package/@gsarthak783/accesskit-react](https://npmjs.com/package/@gsarthak783/accesskit-react)
- **Core SDK**: [https://npmjs.com/package/@gsarthak783/accesskit-auth](https://npmjs.com/package/@gsarthak783/accesskit-auth)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

Built with ❤️ by the AccessKit Team 