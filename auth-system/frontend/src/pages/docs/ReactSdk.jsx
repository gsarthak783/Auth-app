import React, { useState } from 'react';
import { Copy, Check, Code, Package, Zap, Settings, Users } from 'lucide-react';
import DocsLayout from '../../components/Layout/DocsLayout';

const ReactSdk = () => {
  const [copiedCode, setCopiedCode] = useState('');

  const copyToClipboard = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const CodeBlock = ({ code, language = 'jsx', id }) => (
    <div className="relative">
      <div className="flex items-center justify-between bg-base-300 px-4 py-2 rounded-t-lg">
        <span className="text-sm font-medium text-base-content">{language}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center space-x-1 text-sm text-base-content/70 hover:text-base-content transition-colors"
        >
          {copiedCode === id ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="bg-base-100 p-4 rounded-b-lg overflow-x-auto border border-base-300">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <DocsLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Code className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-base-content">React SDK</h1>
          </div>
          <p className="text-xl text-base-content/70">
            React hooks and components for seamless authentication integration in React applications.
          </p>
        </div>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Installation</h2>
          <CodeBlock
            code="npm install @your-auth/react"
            language="bash"
            id="install-react"
          />
        </section>

        {/* Quick Setup */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Quick Setup</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-base-content mb-4">1. Wrap your app with AuthProvider</h3>
            <CodeBlock
              code={`import React from 'react';
import { AuthProvider } from '@your-auth/react';

function App() {
  return (
    <AuthProvider
      config={{
        apiKey: process.env.REACT_APP_AUTH_API_KEY,
        baseUrl: process.env.REACT_APP_AUTH_BASE_URL
      }}
    >
      <AppContent />
    </AuthProvider>
  );
}

export default App;`}
              id="setup-provider"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-base-content mb-4">2. Use the useAuth hook</h3>
            <CodeBlock
              code={`import React from 'react';
import { useAuth } from '@your-auth/react';

function LoginPage() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    login, 
    logout 
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome, {user.firstName}!</h1>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <LoginForm />;
}`}
              id="useauth-hook"
            />
          </div>
        </section>

        {/* Ready-made Components */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Ready-to-Use Components</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">LoginForm Component</h3>
            <CodeBlock
              code={`import { LoginForm } from '@your-auth/react';

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <h1>Welcome Back</h1>
      <LoginForm
        onSuccess={() => {
          console.log('Login successful!');
          navigate('/dashboard');
        }}
        onError={(error) => {
          console.error('Login failed:', error);
          // Show error toast
        }}
        showSignupLink={true}
        onSignupClick={() => navigate('/signup')}
        buttonText="Sign In"
        className="custom-login-form"
      />
    </div>
  );
}`}
              id="login-form"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">SignupForm Component</h3>
            <CodeBlock
              code={`import { SignupForm } from '@your-auth/react';

function SignupPage() {
  return (
    <div className="signup-page">
      <h1>Create Account</h1>
      <SignupForm
        onSuccess={(user) => {
          console.log('Signup successful:', user);
          // Redirect to dashboard or verification page
        }}
        onError={(error) => {
          console.error('Signup failed:', error);
        }}
        showLoginLink={true}
        onLoginClick={() => navigate('/login')}
        requireTerms={true}
        customFields={[
          {
            name: 'company',
            label: 'Company',
            type: 'text',
            required: false
          }
        ]}
      />
    </div>
  );
}`}
              id="signup-form"
            />
          </div>
        </section>

        {/* Authentication Patterns */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Authentication Patterns</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">Protected Routes</h3>
            <CodeBlock
              code={`import { useAuth } from '@your-auth/react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Usage in routes
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>`}
              id="protected-routes"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">Public Routes (Redirect if authenticated)</h3>
            <CodeBlock
              code={`import { useAuth } from '@your-auth/react';
import { Navigate } from 'react-router-dom';

function PublicRoute({ children, redirectTo = '/dashboard' }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

// Usage - redirect authenticated users away from login/signup
<Route 
  path="/login" 
  element={
    <PublicRoute>
      <LoginPage />
    </PublicRoute>
  } 
/>`}
              id="public-routes"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">Role-based Access</h3>
            <CodeBlock
              code={`import { useAuth } from '@your-auth/react';

function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.customFields?.role === 'admin';
  
  if (!isAdmin) {
    return (
      <div className="text-center p-8">
        <h2>Access Denied</h2>
        <p>You don't have permission to view this page.</p>
      </div>
    );
  }

  return children;
}

// Usage
<Route 
  path="/admin" 
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  } 
/>`}
              id="role-based"
            />
          </div>
        </section>

        {/* Advanced Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Advanced Usage</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">Custom Storage Provider</h3>
            <CodeBlock
              code={`import { AuthProvider } from '@your-auth/react';
import { CookieTokenStorage } from '@your-auth/sdk';

// Use cookie storage instead of localStorage
const cookieStorage = new CookieTokenStorage('myapp');

function App() {
  return (
    <AuthProvider
      config={{
        apiKey: process.env.REACT_APP_AUTH_API_KEY,
        baseUrl: process.env.REACT_APP_AUTH_BASE_URL
      }}
      storage={cookieStorage}
      autoInitialize={true}
    >
      <AppContent />
    </AuthProvider>
  );
}`}
              id="custom-storage"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">Manual Authentication</h3>
            <CodeBlock
              code={`import { useAuth } from '@your-auth/react';

function CustomLoginForm() {
  const { login, register, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      // User is automatically updated in context
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignup = async (userData) => {
    try {
      await register(userData);
      // User is automatically updated in context
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={isLoading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={isLoading}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}`}
              id="manual-auth"
            />
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">Profile Management</h3>
            <CodeBlock
              code={`import { useAuth } from '@your-auth/react';

function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    displayName: user?.displayName || '',
    customFields: user?.customFields || {}
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      // User is automatically updated in context
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.firstName}
        onChange={(e) => setFormData({
          ...formData,
          firstName: e.target.value
        })}
        placeholder="First Name"
      />
      
      <input
        type="text"
        value={formData.lastName}
        onChange={(e) => setFormData({
          ...formData,
          lastName: e.target.value
        })}
        placeholder="Last Name"
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
}`}
              id="profile-management"
            />
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Error Handling</h2>
          <CodeBlock
            code={`import { useAuth } from '@your-auth/react';
import { useEffect } from 'react';

function App() {
  const { client } = useAuth();

  useEffect(() => {
    // Global error handling
    const handleAuthError = (data) => {
      const error = data.error;
      
      if (error.message.includes('Network')) {
        // Show network error
        toast.error('Network error. Please check your connection.');
      } else if (error.message.includes('401')) {
        // Handle unauthorized
        toast.error('Session expired. Please login again.');
      } else {
        // Handle other errors
        toast.error(error.message);
      }
    };

    client.on('error', handleAuthError);

    return () => {
      client.off('error', handleAuthError);
    };
  }, [client]);

  return <AppContent />;
}`}
            id="error-handling"
          />
        </section>

        {/* Next.js Integration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Next.js Integration</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-base-content mb-4">App Router (Next.js 13+)</h3>
            <CodeBlock
              code={`// app/providers.tsx
'use client';

import { AuthProvider } from '@your-auth/react';

export function Providers({ children }) {
  return (
    <AuthProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_AUTH_API_KEY!,
        baseUrl: process.env.NEXT_PUBLIC_AUTH_BASE_URL!
      }}
    >
      {children}
    </AuthProvider>
  );
}

// app/layout.tsx
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}`}
              id="nextjs-app-router"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-base-content mb-4">Pages Router (Next.js 12 and below)</h3>
            <CodeBlock
              code={`// pages/_app.tsx
import type { AppProps } from 'next/app';
import { AuthProvider } from '@your-auth/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider
      config={{
        apiKey: process.env.NEXT_PUBLIC_AUTH_API_KEY!,
        baseUrl: process.env.NEXT_PUBLIC_AUTH_BASE_URL!
      }}
    >
      <Component {...pageProps} />
    </AuthProvider>
  );
}`}
              id="nextjs-pages-router"
            />
          </div>
        </section>

        {/* TypeScript Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">TypeScript Support</h2>
          <CodeBlock
            code={`import { useAuth } from '@your-auth/react';
import type { User } from '@your-auth/sdk';

// Extend User type with custom fields
interface ExtendedUser extends User {
  customFields: {
    company?: string;
    role?: 'admin' | 'user' | 'moderator';
    preferences?: {
      theme: 'light' | 'dark';
      newsletter: boolean;
    };
  };
}

function TypedComponent() {
  const { user, updateProfile } = useAuth();
  
  // Type-safe access to custom fields
  const userRole = (user as ExtendedUser)?.customFields?.role;
  const company = (user as ExtendedUser)?.customFields?.company;
  
  const handleUpdatePreferences = async () => {
    await updateProfile({
      customFields: {
        ...user?.customFields,
        preferences: {
          theme: 'dark',
          newsletter: true
        }
      }
    });
  };

  return (
    <div>
      <p>Role: {userRole}</p>
      <p>Company: {company}</p>
      <button onClick={handleUpdatePreferences}>
        Update Preferences
      </button>
    </div>
  );
}`}
            id="typescript-support"
          />
        </section>

        {/* Performance Tips */}
        <section className="bg-base-200 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Performance Tips</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-base-content mb-2">1. Minimize Re-renders</h3>
              <p className="text-base-content/70 text-sm">
                The AuthProvider uses React context optimally to minimize re-renders. 
                Only components that access changed auth state will re-render.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-base-content mb-2">2. Use Loading States</h3>
              <p className="text-base-content/70 text-sm">
                Always check `isLoading` before rendering auth-dependent content to provide 
                better user experience during authentication state changes.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-base-content mb-2">3. Lazy Load Protected Routes</h3>
              <p className="text-base-content/70 text-sm">
                Use React.lazy() to code-split protected routes and only load them when 
                the user is authenticated.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default ReactSdk; 