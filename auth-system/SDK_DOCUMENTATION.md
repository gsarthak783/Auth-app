# AccessKit SDK Documentation

Comprehensive documentation for AccessKit's JavaScript/TypeScript and React SDKs.

## 📦 Available Packages

### Core SDK - JavaScript/TypeScript
```bash
npm install @gsarthak783/accesskit-auth
```
- **Universal**: Works with any JavaScript/TypeScript project
- **Framework Agnostic**: React, Vue, Angular, Node.js, etc.
- **Full Featured**: Complete authentication API
- **TypeScript**: Full type definitions included

### React SDK
```bash
npm install @gsarthak783/accesskit-react
```
- **React Hooks**: `useAuth` hook for easy integration
- **Context Provider**: `AuthProvider` for app-wide state
- **Ready Components**: Pre-built login forms and components
- **Auto Dependency**: Includes core SDK automatically

## 🚀 Core SDK (@gsarthak783/accesskit-auth)

### Installation & Setup

```bash
npm install @gsarthak783/accesskit-auth
```

### Basic Configuration

```javascript
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',      // From AccessKit dashboard
  apiKey: 'your-api-key',            // From project settings
  baseUrl: 'https://access-kit-server.vercel.app/api/project-users', // Optional, defaults to this
  timeout: 10000                     // Optional, request timeout
});
```

### Authentication Methods

#### User Registration
```javascript
try {
  const result = await auth.register({
    email: 'user@example.com',
    password: 'securepassword',
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',              // Optional
    customFields: {                   // Optional
      role: 'user',
      department: 'engineering'
    }
  });
  
  console.log('User created:', result.user);
  console.log('Access token:', result.accessToken);
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

#### User Login
```javascript
try {
  const result = await auth.login({
    email: 'user@example.com',
    password: 'securepassword'
  });
  
  console.log('Login successful:', result.user);
  // Tokens are automatically stored
} catch (error) {
  console.error('Login failed:', error.message);
}
```

#### Check Authentication Status
```javascript
if (auth.isAuthenticated()) {
  console.log('User is logged in');
  const token = auth.getAccessToken();
  console.log('Current token:', token);
} else {
  console.log('User needs to log in');
}
```

#### Logout
```javascript
await auth.logout();
console.log('User logged out successfully');
```

### Profile Management

#### Get User Profile
```javascript
try {
  const profile = await auth.getProfile();
  console.log('User profile:', profile);
} catch (error) {
  console.error('Failed to get profile:', error.message);
}
```

#### Update Profile
```javascript
try {
  const updatedUser = await auth.updateProfile({
    firstName: 'Jane',
    lastName: 'Smith',
    customFields: {
      role: 'admin',
      bio: 'Software engineer'
    }
  });
  console.log('Profile updated:', updatedUser);
} catch (error) {
  console.error('Update failed:', error.message);
}
```

### Password Management

#### Request Password Reset
```javascript
try {
  await auth.requestPasswordReset('user@example.com');
  console.log('Reset email sent');
} catch (error) {
  console.error('Reset request failed:', error.message);
}
```

#### Reset Password with Token
```javascript
try {
  await auth.resetPassword('reset-token-from-email', 'newpassword123');
  console.log('Password reset successful');
} catch (error) {
  console.error('Password reset failed:', error.message);
}
```

#### Verify Email
```javascript
try {
  await auth.verifyEmail('verification-token-from-email');
  console.log('Email verified successfully');
} catch (error) {
  console.error('Email verification failed:', error.message);
}
```

### Token Management

#### Manual Token Refresh
```javascript
try {
  const newToken = await auth.refreshAccessToken();
  console.log('Token refreshed:', newToken);
} catch (error) {
  console.error('Token refresh failed:', error.message);
  // User will be logged out automatically
}
```

#### Get Current Token
```javascript
const accessToken = auth.getAccessToken();
const refreshToken = auth.getRefreshToken();
```

### Admin Functions (API Key Required)

#### Get All Users
```javascript
try {
  const users = await auth.getAllUsers({
    page: 1,
    limit: 50,
    search: 'john@example.com',
    status: 'active'
  });
  
  console.log('Users:', users.data);
  console.log('Total:', users.total);
  console.log('Pages:', users.pages);
} catch (error) {
  console.error('Failed to get users:', error.message);
}
```

#### Delete User
```javascript
try {
  await auth.deleteUser('user-id-123');
  console.log('User deleted successfully');
} catch (error) {
  console.error('Delete failed:', error.message);
}
```

#### Update User Status
```javascript
try {
  await auth.updateUserStatus('user-id-123', 'suspended');
  console.log('User status updated');
} catch (error) {
  console.error('Status update failed:', error.message);
}
```

#### Get Statistics
```javascript
try {
  const stats = await auth.getStats();
  console.log('User statistics:', stats);
} catch (error) {
  console.error('Failed to get stats:', error.message);
}
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
  console.error('Authentication error:', error);
});

auth.on('profile_update', (data) => {
  console.log('Profile updated:', data.user);
});

// Remove event listeners
auth.off('login', loginHandler);
```

### Custom Storage

```javascript
import { TokenStorage } from '@gsarthak783/accesskit-auth';

class CustomStorage implements TokenStorage {
  getItem(key: string): string | null {
    // Your custom storage logic (e.g., AsyncStorage for React Native)
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

## ⚛️ React SDK (@gsarthak783/accesskit-react)

### Installation & Setup

```bash
npm install @gsarthak783/accesskit-react
```

### AuthProvider Setup

```jsx
import React from 'react';
import { AuthProvider } from '@gsarthak783/accesskit-react';

function App() {
  return (
    <AuthProvider 
      config={{
        projectId: 'your-project-id',
        apiKey: 'your-api-key'
      }}
      autoInitialize={true}        // Optional: auto-check auth on mount
      storage={customStorage}      // Optional: custom token storage
    >
      <YourApp />
    </AuthProvider>
  );
}
```

### useAuth Hook

```jsx
import { useAuth } from '@gsarthak783/accesskit-react';

function MyComponent() {
  const {
    // State
    user,                    // Current user object or null
    isLoading,              // Loading state boolean
    isAuthenticated,        // Authentication status boolean
    
    // Authentication methods
    login,                  // (email, password) => Promise<void>
    register,               // (userData) => Promise<void>
    logout,                 // () => Promise<void>
    
    // Profile methods
    updateProfile,          // (userData) => Promise<void>
    requestPasswordReset,   // (email) => Promise<void>
    resetPassword,          // (token, password) => Promise<void>
    verifyEmail,            // (token) => Promise<void>
    
    // Direct SDK access
    client                  // AuthClient instance
  } = useAuth();

  // Component logic here...
}
```

### Authentication Components

#### Login Flow
```jsx
function LoginPage() {
  const { login, isLoading, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

#### Registration Flow
```jsx
function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      // User is automatically logged in after registration
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={formData.firstName}
        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={formData.lastName}
        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
        placeholder="Last Name"
      />
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        placeholder="Username"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
}
```

#### User Profile Component
```jsx
function UserProfile() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {isEditing ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            placeholder="First Name"
          />
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            placeholder="Last Name"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>Name: {user.firstName} {user.lastName}</p>
          <p>Email: {user.email}</p>
          <p>Status: {user.status}</p>
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}
```

### Protected Routes

```jsx
import { useAuth } from '@gsarthak783/accesskit-react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.customFields?.role !== requiredRole) {
    return <div>Access denied. Required role: {requiredRole}</div>;
  }

  return children;
}

// Usage
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <ProtectedRoute requiredRole="admin">
          <AdminPanel />
        </ProtectedRoute>
      } />
    </Routes>
  );
}
```

### Ready-to-Use Components

#### LoginForm Component
```jsx
import { LoginForm } from '@gsarthak783/accesskit-react';

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
          // Show error message
        }}
        className="custom-login-form"
        buttonText="Sign In"
        showSignupLink={true}
        onSignupClick={() => navigate('/signup')}
      />
    </div>
  );
}
```

### Admin Features with React

```jsx
function AdminPanel() {
  const { client } = useAuth(); // Direct access to AuthClient
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await client.getAllUsers({ page: 1, limit: 50 });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await client.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await client.deleteUser(userId);
      loadUsers(); // Refresh list
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleUpdateUserStatus = async (userId, status) => {
    try {
      await client.updateUserStatus(userId, status);
      loadUsers(); // Refresh list
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      
      {stats && (
        <div className="stats">
          <p>Total Users: {stats.totalUsers}</p>
          <p>Active Users: {stats.activeUsers}</p>
          <p>New Users Today: {stats.newUsersToday}</p>
        </div>
      )}

      <div className="users-list">
        <h3>Users</h3>
        {users.map(user => (
          <div key={user.id} className="user-item">
            <span>{user.firstName} {user.lastName} ({user.email})</span>
            <span>Status: {user.status}</span>
            <button onClick={() => handleUpdateUserStatus(user.id, 'suspended')}>
              Suspend
            </button>
            <button onClick={() => handleDeleteUser(user.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 🔗 Framework Integrations

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

// pages/api/auth/[...nextauth].js
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: process.env.AUTH_PROJECT_ID,
  apiKey: process.env.AUTH_API_KEY
});

export default async function handler(req, res) {
  // Handle auth API routes
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

## 🔒 Security Best Practices

### Environment Variables
```bash
# .env.local (Next.js)
NEXT_PUBLIC_AUTH_PROJECT_ID=your-project-id
AUTH_API_KEY=your-api-key  # Server-side only

# .env (React)
REACT_APP_AUTH_PROJECT_ID=your-project-id
# Don't expose API keys in React - use server-side proxy

# .env (Node.js)
AUTH_PROJECT_ID=your-project-id
AUTH_API_KEY=your-api-key
AUTH_BASE_URL=https://access-kit-server.vercel.app/api/project-users
```

### Token Security
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

## 📊 TypeScript Support

Both SDKs are written in TypeScript and include complete type definitions:

```typescript
import { 
  AuthClient, 
  User, 
  AuthConfig, 
  LoginCredentials, 
  CreateUserData,
  AuthResponse,
  ApiResponse 
} from '@gsarthak783/accesskit-auth';

import { 
  useAuth, 
  AuthProvider 
} from '@gsarthak783/accesskit-react';

// Type-safe configuration
const config: AuthConfig = {
  projectId: 'your-project-id',
  apiKey: 'your-api-key',
  timeout: 10000
};

// Type-safe user data
const userData: CreateUserData = {
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe',
  customFields: {
    role: 'user' as const
  }
};
```

## 📞 Support & Resources

### Links
- **Live API**: [https://access-kit-server.vercel.app](https://access-kit-server.vercel.app)
- **GitHub Repository**: [https://github.com/gsarthak783/Auth-app](https://github.com/gsarthak783/Auth-app)
- **Core SDK**: [https://npmjs.com/package/@gsarthak783/accesskit-auth](https://npmjs.com/package/@gsarthak783/accesskit-auth)
- **React SDK**: [https://npmjs.com/package/@gsarthak783/accesskit-react](https://npmjs.com/package/@gsarthak783/accesskit-react)
- **Issues & Support**: [https://github.com/gsarthak783/Auth-app/issues](https://github.com/gsarthak783/Auth-app/issues)

### Getting Help
1. Check the [API documentation](https://access-kit-server.vercel.app) first
2. Search [existing issues](https://github.com/gsarthak783/Auth-app/issues)
3. Create a new issue with:
   - SDK version
   - Framework/environment
   - Code example
   - Error messages

---

Built with ❤️ by the AccessKit Team 