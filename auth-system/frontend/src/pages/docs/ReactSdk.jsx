import React, { useState } from 'react';
import { Copy, Check, Code, Download, ExternalLink, Heart, Zap, Shield } from 'lucide-react';

const ReactSdk = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CodeBlock = ({ code, language, id }) => (
    <div className="relative">
      <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 btn btn-sm btn-ghost"
        title="Copy to clipboard"
      >
        {copiedCode === id ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-base-content mb-4">
          React SDK
        </h1>
        <p className="text-xl text-base-content/70 mb-6">
          Ready-to-use React hooks and components for AccessKit Authentication
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="https://npmjs.com/package/@gsarthak783/accesskit-react" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <Download size={16} />
            Install from npm
            <ExternalLink size={16} />
          </a>
          <a 
            href="https://github.com/gsarthak783/Auth-app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            <Code size={16} />
            View Source
            <ExternalLink size={16} />
          </a>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          <div className="badge badge-primary">React 16.8+</div>
          <div className="badge badge-secondary">TypeScript</div>
          <div className="badge badge-accent">Hooks</div>
          <div className="badge badge-info">Context</div>
        </div>
      </div>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Zap size={32} className="mx-auto mb-4 text-primary" />
              <h3 className="card-title justify-center">Easy Setup</h3>
              <p className="text-base-content/70">
                Get started in minutes with our AuthProvider and useAuth hook
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Shield size={32} className="mx-auto mb-4 text-secondary" />
              <h3 className="card-title justify-center">Secure by Default</h3>
              <p className="text-base-content/70">
                Automatic token management and secure storage options
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Heart size={32} className="mx-auto mb-4 text-accent" />
              <h3 className="card-title justify-center">Developer Friendly</h3>
              <p className="text-base-content/70">
                Full TypeScript support and excellent developer experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Installation</h2>
        
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Install the Package</h3>
            <p className="text-base-content/70 mb-4">
              The React SDK automatically includes the core SDK as a dependency.
            </p>
            <CodeBlock
              code="npm install @gsarthak783/accesskit-react"
              language="bash"
              id="install-react"
            />
          </div>
        </div>

        <div className="alert alert-info">
          <div>
            <strong>Note:</strong> This package automatically includes <code>@gsarthak783/accesskit-auth</code> as a dependency.
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Quick Start</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">1. Wrap Your App with AuthProvider</h3>
            <CodeBlock
              code={`import React from 'react';
import { AuthProvider } from '@gsarthak783/accesskit-react';

function App() {
  return (
    <AuthProvider 
      config={{
        projectId: 'your-project-id',
        apiKey: 'your-api-key'
      }}
    >
      <YourApp />
    </AuthProvider>
  );
}

export default App;`}
              language="jsx"
              id="auth-provider-setup"
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">2. Use the useAuth Hook</h3>
            <CodeBlock
              code={`import { useAuth } from '@gsarthak783/accesskit-react';

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
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
        <button onClick={() => register({
          email: 'user@example.com',
          password: 'password',
          firstName: 'John',
          lastName: 'Doe'
        })}>
          Register
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}`}
              language="jsx"
              id="use-auth-basic"
            />
          </div>
        </div>
      </section>

      {/* AuthProvider Configuration */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">AuthProvider Configuration</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Configuration Options</h3>
            <CodeBlock
              code={`<AuthProvider 
  config={{
    projectId: 'your-project-id',
    apiKey: 'your-api-key',
    baseUrl: 'https://access-kit-server.vercel.app/api/project-users', // Optional
    timeout: 10000 // Optional, request timeout in ms
  }}
  storage={customStorage}      // Optional, custom token storage
  autoInitialize={true}        // Optional, auto-check auth on mount
>
  <App />
</AuthProvider>`}
              language="jsx"
              id="auth-provider-config"
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Custom Storage (React Native Example)</h3>
            <p className="text-base-content/70 mb-4">
              For React Native or when you need secure storage:
            </p>
            <CodeBlock
              code={`import { AuthProvider } from '@gsarthak783/accesskit-react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom storage for React Native
const customStorage = {
  getItem: async (key) => await AsyncStorage.getItem(key),
  setItem: async (key, value) => await AsyncStorage.setItem(key, value),
  removeItem: async (key) => await AsyncStorage.removeItem(key)
};

<AuthProvider config={config} storage={customStorage}>
  <App />
</AuthProvider>`}
              language="jsx"
              id="custom-storage"
            />
          </div>
        </div>
      </section>

      {/* useAuth Hook */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">useAuth Hook Reference</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Available Properties and Methods</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Property/Method</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>user</code></td>
                    <td><code>User | null</code></td>
                    <td>Current user object or null if not authenticated</td>
                  </tr>
                  <tr>
                    <td><code>isLoading</code></td>
                    <td><code>boolean</code></td>
                    <td>Loading state for authentication operations</td>
                  </tr>
                  <tr>
                    <td><code>isAuthenticated</code></td>
                    <td><code>boolean</code></td>
                    <td>Whether the user is currently authenticated</td>
                  </tr>
                  <tr>
                    <td><code>login</code></td>
                    <td><code>(email, password) =&gt; Promise&lt;void&gt;</code></td>
                    <td>Login with email and password</td>
                  </tr>
                  <tr>
                    <td><code>register</code></td>
                    <td><code>(userData) =&gt; Promise&lt;void&gt;</code></td>
                    <td>Register a new user</td>
                  </tr>
                  <tr>
                    <td><code>logout</code></td>
                    <td><code>() =&gt; Promise&lt;void&gt;</code></td>
                    <td>Logout the current user</td>
                  </tr>
                  <tr>
                    <td><code>updateProfile</code></td>
                    <td><code>(userData) =&gt; Promise&lt;void&gt;</code></td>
                    <td>Update user profile information</td>
                  </tr>
                  <tr>
                    <td><code>requestPasswordReset</code></td>
                    <td><code>(email) =&gt; Promise&lt;void&gt;</code></td>
                    <td>Request password reset email</td>
                  </tr>
                  <tr>
                    <td><code>resetPassword</code></td>
                    <td><code>(token, password) =&gt; Promise&lt;void&gt;</code></td>
                    <td>Reset password with token</td>
                  </tr>
                  <tr>
                    <td><code>verifyEmail</code></td>
                    <td><code>(token) =&gt; Promise&lt;void&gt;</code></td>
                    <td>Verify email with verification token</td>
                  </tr>
                  <tr>
                    <td><code>client</code></td>
                    <td><code>AuthClient</code></td>
                    <td>Direct access to the underlying AuthClient instance</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Component Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Component Examples</h2>

        {/* Login Form */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Login Form Component</h3>
            <CodeBlock
              code={`import { useState } from 'react';
import { useAuth } from '@gsarthak783/accesskit-react';

function LoginForm() {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Email"
          className="input input-bordered w-full"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          placeholder="Password"
          className="input input-bordered w-full"
          required
        />
      </div>
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
      <button 
        type="submit" 
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}`}
              language="jsx"
              id="login-form"
            />
          </div>
        </div>

        {/* Registration Form */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Registration Form Component</h3>
            <CodeBlock
              code={`import { useState } from 'react';
import { useAuth } from '@gsarthak783/accesskit-react';

function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(formData);
      // User is automatically logged in after registration
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          placeholder="First Name"
          className="input input-bordered"
          required
        />
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          placeholder="Last Name"
          className="input input-bordered"
        />
      </div>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        className="input input-bordered w-full"
        required
      />
      <input
        type="text"
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
        placeholder="Username (optional)"
        className="input input-bordered w-full"
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
        className="input input-bordered w-full"
        required
      />
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
      <button 
        type="submit" 
        disabled={isLoading}
        className="btn btn-primary w-full"
      >
        {isLoading ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
}`}
              language="jsx"
              id="register-form"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">User Profile Component</h3>
            <CodeBlock
              code={`import { useState } from 'react';
import { useAuth } from '@gsarthak783/accesskit-react';

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
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Profile</h2>
        
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              placeholder="First Name"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              placeholder="Last Name"
              className="input input-bordered w-full"
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary">Save</button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Status:</strong> 
                <span className={\`badge \${user.status === 'active' ? 'badge-success' : 'badge-warning'}\`}>
                  {user.status}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Profile
              </button>
              <button 
                onClick={logout}
                className="btn btn-outline btn-error"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`}
              language="jsx"
              id="user-profile"
            />
          </div>
        </div>
      </section>

      {/* Protected Routes */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Protected Routes</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">ProtectedRoute Component</h3>
            <CodeBlock
              code={`import { useAuth } from '@gsarthak783/accesskit-react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.customFields?.role !== requiredRole) {
    return (
      <div className="alert alert-error">
        <span>Access denied. Required role: {requiredRole}</span>
      </div>
    );
  }

  return children;
}

// Usage in App.jsx
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
}`}
              language="jsx"
              id="protected-route"
            />
          </div>
        </div>
      </section>

      {/* Ready-to-Use Components */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Ready-to-Use Components</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">LoginForm Component</h3>
            <p className="text-base-content/70 mb-4">
              A complete login form with validation and error handling:
            </p>
            <CodeBlock
              code={`import { LoginForm } from '@gsarthak783/accesskit-react';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <LoginForm
          onSuccess={() => {
            console.log('Login successful!');
            // Redirect or update UI
          }}
          onError={(error) => {
            console.error('Login failed:', error);
            // Show error message
          }}
          className="card bg-base-100 shadow-xl p-6"
          buttonText="Sign In"
          showSignupLink={true}
          onSignupClick={() => navigate('/signup')}
        />
      </div>
    </div>
  );
}`}
              language="jsx"
              id="ready-login-form"
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">LoginForm Props</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Prop</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>onSuccess</code></td>
                    <td><code>() => void</code></td>
                    <td>-</td>
                    <td>Called on successful login</td>
                  </tr>
                  <tr>
                    <td><code>onError</code></td>
                    <td><code>(error: Error) =&gt; void</code></td>
                    <td>-</td>
                    <td>Called on login error</td>
                  </tr>
                  <tr>
                    <td><code>className</code></td>
                    <td><code>string</code></td>
                    <td>-</td>
                    <td>CSS classes for the form container</td>
                  </tr>
                  <tr>
                    <td><code>buttonText</code></td>
                    <td><code>string</code></td>
                    <td>"Login"</td>
                    <td>Text for the submit button</td>
                  </tr>
                  <tr>
                    <td><code>showSignupLink</code></td>
                    <td><code>boolean</code></td>
                    <td>false</td>
                    <td>Whether to show signup link</td>
                  </tr>
                  <tr>
                    <td><code>onSignupClick</code></td>
                    <td><code>() =&gt; void</code></td>
                    <td>-</td>
                    <td>Called when signup link is clicked</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Admin Features</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Admin Panel Example</h3>
            <p className="text-base-content/70 mb-4">
              Access admin functions through the client property:
            </p>
            <CodeBlock
              code={`import { useAuth } from '@gsarthak783/accesskit-react';
import { useState, useEffect } from 'react';

function AdminPanel() {
  const { client, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersResponse, statsResponse] = await Promise.all([
        client.getAllUsers({ page: 1, limit: 50 }),
        client.getStats()
      ]);
      setUsers(usersResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await client.deleteUser(userId);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleUpdateUserStatus = async (userId, status) => {
    try {
      await client.updateUserStatus(userId, status);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      
      {/* Statistics */}
      {stats && (
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Active Users</div>
            <div className="stat-value">{stats.activeUsers}</div>
          </div>
          <div className="stat">
            <div className="stat-title">New Users Today</div>
            <div className="stat-value">{stats.newUsersToday}</div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Users</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={\`badge \${
                        user.status === 'active' ? 'badge-success' : 
                        user.status === 'suspended' ? 'badge-error' : 'badge-warning'
                      }\`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="space-x-2">
                      <button 
                        onClick={() => handleUpdateUserStatus(user.id, 'suspended')}
                        className="btn btn-warning btn-sm"
                        disabled={user.status === 'suspended'}
                      >
                        Suspend
                      </button>
                      <button 
                        onClick={() => handleUpdateUserStatus(user.id, 'active')}
                        className="btn btn-success btn-sm"
                        disabled={user.status === 'active'}
                      >
                        Activate
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}`}
              language="jsx"
              id="admin-panel"
            />
          </div>
        </div>
      </section>

      {/* TypeScript Support */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">TypeScript Support</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Type-Safe Components</h3>
            <CodeBlock
              code={`import { useAuth } from '@gsarthak783/accesskit-react';
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
};`}
              language="tsx"
              id="typescript-example"
            />
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Security Best Practices</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Environment Variables</h3>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-red-900 mb-2">❌ Don't do this:</h4>
              <CodeBlock
                code={`// Never expose API keys in frontend code!
const config = {
  projectId: 'proj_123',
  apiKey: 'sk_live_abc123' // This is visible to users!
};`}
                language="jsx"
                id="bad-example"
              />
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">✅ Do this instead:</h4>
              <CodeBlock
                code={`// Use environment variables and only expose what's needed
const config = {
  projectId: process.env.REACT_APP_PROJECT_ID,
  // API keys should only be used server-side
  // For client-side, use public project ID only
};`}
                language="jsx"
                id="good-example"
              />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Secure Token Storage</h3>
            <CodeBlock
              code={`// For React Native with secure storage
import * as SecureStore from 'expo-secure-store';

const secureStorage = {
  getItem: async (key) => await SecureStore.getItemAsync(key),
  setItem: async (key, value) => await SecureStore.setItemAsync(key, value),
  removeItem: async (key) => await SecureStore.deleteItemAsync(key)
};

<AuthProvider config={config} storage={secureStorage}>
  <App />
</AuthProvider>`}
              language="jsx"
              id="secure-storage"
            />
          </div>
        </div>
      </section>

      {/* Links and Resources */}
      <section className="mb-12">
        <div className="alert alert-info">
          <div>
            <h3 className="font-semibold">Useful Links</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <a href="https://npmjs.com/package/@gsarthak783/accesskit-react" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                npm Package <ExternalLink size={16} />
              </a>
              <a href="https://npmjs.com/package/@gsarthak783/accesskit-auth" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Core SDK <ExternalLink size={16} />
              </a>
              <a href="https://github.com/gsarthak783/Auth-app" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                GitHub <ExternalLink size={16} />
              </a>
              <a href="/docs/api-reference" className="btn btn-outline btn-sm">
                API Reference
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReactSdk; 