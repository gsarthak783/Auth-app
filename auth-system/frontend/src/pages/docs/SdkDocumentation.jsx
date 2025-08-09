import React, { useState } from 'react';
import { Copy, Check, Code, Package, Download, ExternalLink, Zap, Shield, Users } from 'lucide-react';

const SdkDocumentation = () => {
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
      <pre className="bg-base-200 p-3 sm:p-4 rounded-lg overflow-x-auto">
        <code className={`language-${language} text-xs sm:text-sm`}>{code}</code>
      </pre>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 btn btn-xs sm:btn-sm btn-ghost"
        title="Copy to clipboard"
      >
        {copiedCode === id ? <Check size={14} className="sm:w-4 sm:h-4" /> : <Copy size={14} className="sm:w-4 sm:h-4" />}
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-4">
          SDK Documentation
        </h1>
        <p className="text-xl text-base-content/70 mb-6">
          Comprehensive documentation for AccessKit's JavaScript/TypeScript and React SDKs
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a 
            href="https://npmjs.com/package/@gsarthak783/accesskit-auth" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <Download size={16} />
            Core SDK
            <ExternalLink size={16} />
          </a>
          <a 
            href="https://npmjs.com/package/@gsarthak783/accesskit-react" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            <Download size={16} />
            React SDK
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Overview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Overview</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <Code size={20} />
                Core SDK (@gsarthak783/accesskit-auth)
              </h3>
              <p className="text-base-content/70 mb-4">
                Universal JavaScript/TypeScript SDK that works with any framework or environment.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-base-content/70">
                <li>Framework agnostic</li>
                <li>Full TypeScript support</li>
                <li>Complete authentication API</li>
                <li>Token management</li>
                <li>Event system</li>
              </ul>
              <div className="card-actions justify-end mt-4">
                <div className="badge badge-primary">Universal</div>
                <div className="badge badge-outline">TypeScript</div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <Package size={20} />
                React SDK (@gsarthak783/accesskit-react)
              </h3>
              <p className="text-base-content/70 mb-4">
                React-specific SDK with hooks, context provider, and ready-to-use components.
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-base-content/70">
                <li>useAuth hook</li>
                <li>AuthProvider context</li>
                <li>Ready-to-use components</li>
                <li>Auto dependency management</li>
                <li>TypeScript support</li>
              </ul>
              <div className="card-actions justify-end mt-4">
                <div className="badge badge-secondary">React</div>
                <div className="badge badge-outline">Hooks</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Zap size={32} className="mx-auto mb-4 text-primary" />
              <h3 className="card-title justify-center">Easy Integration</h3>
              <p className="text-base-content/70">
                Get started in minutes with simple installation and intuitive APIs
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Shield size={32} className="mx-auto mb-4 text-secondary" />
              <h3 className="card-title justify-center">Secure by Default</h3>
              <p className="text-base-content/70">
                Built-in security features including automatic token management
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center">
              <Users size={32} className="mx-auto mb-4 text-accent" />
              <h3 className="card-title justify-center">Complete User Management</h3>
              <p className="text-base-content/70">
                Full user lifecycle including registration, login, and profile management
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Installation</h2>
        
        <div className="tabs tabs-boxed mb-6">
          <input type="radio" name="install_tabs" className="tab" aria-label="JavaScript SDK" defaultChecked />
          <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className="text-xl font-semibold mb-4">Core JavaScript/TypeScript SDK</h3>
            <p className="text-base-content/70 mb-4">
              For any JavaScript/TypeScript project including Node.js, Vue, Angular, vanilla JS, etc.
            </p>
            <CodeBlock
              code="npm install @gsarthak783/accesskit-auth"
              language="bash"
              id="install-core"
            />
          </div>

          <input type="radio" name="install_tabs" className="tab" aria-label="React SDK" />
          <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className="text-xl font-semibold mb-4">React SDK</h3>
            <p className="text-base-content/70 mb-4">
              For React applications. Automatically includes the core SDK as a dependency.
            </p>
            <CodeBlock
              code="npm install @gsarthak783/accesskit-react"
              language="bash"
              id="install-react"
            />
          </div>
        </div>
      </section>

      {/* Core SDK Documentation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Core SDK (@gsarthak783/accesskit-auth)</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Basic Setup</h3>
            <CodeBlock
              code={`import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
  // baseUrl: 'https://access-kit-server.vercel.app/api/project-users' // Optional, defaults to this
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

// Check authentication
if (auth.isAuthenticated()) {
  const profile = await auth.getProfile();
  console.log('User profile:', profile);
}`}
              language="javascript"
              id="core-setup"
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Configuration Options</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Required</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>projectId</code></td>
                    <td>string</td>
                    <td>✅</td>
                    <td>Your project ID from AccessKit dashboard</td>
                  </tr>
                  <tr>
                    <td><code>apiKey</code></td>
                    <td>string</td>
                    <td>✅</td>
                    <td>Your project API key</td>
                  </tr>
                  <tr>
                    <td><code>baseUrl</code></td>
                    <td>string</td>
                    <td>❌</td>
                    <td>API base URL (defaults to live server)</td>
                  </tr>
                  <tr>
                    <td><code>timeout</code></td>
                    <td>number</td>
                    <td>❌</td>
                    <td>Request timeout in milliseconds (default: 10000)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Core Methods</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-base-content mb-2">Authentication</h4>
                <CodeBlock
                  code={`// Register new user
const user = await auth.register({
  email: 'user@example.com',
  password: 'securepassword',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe', // optional
  customFields: { role: 'user' } // optional
});

// Login user
const response = await auth.login({
  email: 'user@example.com',
  password: 'securepassword'
});

// Logout user
await auth.logout();

// Check authentication status
const isLoggedIn = auth.isAuthenticated();`}
                  language="javascript"
                  id="auth-methods"
                />
              </div>

              <div>
                <h4 className="font-semibold text-base-content mb-2">Profile Management</h4>
                <CodeBlock
                  code={`// Get user profile
const profile = await auth.getProfile();

// Update profile
const updatedUser = await auth.updateProfile({
  firstName: 'Jane',
  customFields: { role: 'admin' }
});

// Request password reset
await auth.requestPasswordReset('user@example.com');

// Reset password with token
await auth.resetPassword('reset-token', 'newpassword');

// Verify email
await auth.verifyEmail('verification-token');`}
                  language="javascript"
                  id="profile-methods"
                />
              </div>

              <div>
                <h4 className="font-semibold text-base-content mb-2">Admin Functions (API Key Required)</h4>
                <CodeBlock
                  code={`// Get all users
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
const stats = await auth.getStats();`}
                  language="javascript"
                  id="admin-methods"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Event Handling</h3>
            <CodeBlock
              code={`// Listen to authentication events
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

// Remove event listeners
auth.off('login', loginHandler);`}
              language="javascript"
              id="events"
            />
          </div>
        </div>
      </section>

      {/* React SDK Documentation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">React SDK (@gsarthak783/accesskit-react)</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Basic Setup</h3>
            <CodeBlock
              code={`import React from 'react';
import { AuthProvider, useAuth } from '@gsarthak783/accesskit-react';

// 1. Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider config={{
      projectId: 'your-project-id',
      apiKey: 'your-api-key'
    }}>
      <MyComponent />
    </AuthProvider>
  );
}

// 2. Use the useAuth hook in components
function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <button onClick={() => login('user@example.com', 'password')}>
        Login
      </button>
    );
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}`}
              language="jsx"
              id="react-setup"
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">useAuth Hook Properties</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>user</code></td>
                    <td>User | null</td>
                    <td>Current user object or null</td>
                  </tr>
                  <tr>
                    <td><code>isLoading</code></td>
                    <td>boolean</td>
                    <td>Loading state for auth operations</td>
                  </tr>
                  <tr>
                    <td><code>isAuthenticated</code></td>
                    <td>boolean</td>
                    <td>Whether user is authenticated</td>
                  </tr>
                  <tr>
                    <td><code>login</code></td>
                    <td>function</td>
                    <td>Login with email and password</td>
                  </tr>
                  <tr>
                    <td><code>register</code></td>
                    <td>function</td>
                    <td>Register a new user</td>
                  </tr>
                  <tr>
                    <td><code>logout</code></td>
                    <td>function</td>
                    <td>Logout current user</td>
                  </tr>
                  <tr>
                    <td><code>updateProfile</code></td>
                    <td>function</td>
                    <td>Update user profile</td>
                  </tr>
                  <tr>
                    <td><code>client</code></td>
                    <td>AuthClient</td>
                    <td>Direct access to core SDK</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Ready-to-Use Components</h3>
            <CodeBlock
              code={`import { LoginForm } from '@gsarthak783/accesskit-react';

function LoginPage() {
  return (
    <LoginForm
      onSuccess={() => console.log('Login successful!')}
      onError={(error) => console.error('Login failed:', error)}
      className="custom-login-form"
      buttonText="Sign In"
      showSignupLink={true}
      onSignupClick={() => navigate('/signup')}
    />
  );
}`}
              language="jsx"
              id="login-component"
            />
          </div>
        </div>
      </section>

      {/* Framework Integration Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Framework Integration Examples</h2>

        <div className="tabs tabs-boxed mb-6">
          <input type="radio" name="framework_tabs" className="tab" aria-label="Next.js" defaultChecked />
          <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className="text-xl font-semibold mb-4">Next.js Integration</h3>
            <CodeBlock
              code={`// pages/_app.js
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
}`}
              language="javascript"
              id="nextjs-example"
            />
          </div>

          <input type="radio" name="framework_tabs" className="tab" aria-label="Vue.js" />
          <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className="text-xl font-semibold mb-4">Vue.js Integration</h3>
            <CodeBlock
              code={`// main.js
import { createApp } from 'vue';
import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});

const app = createApp(App);
app.config.globalProperties.$auth = auth;
app.mount('#app');

// In component
export default {
  async mounted() {
    if (this.$auth.isAuthenticated()) {
      this.user = await this.$auth.getProfile();
    }
  }
}`}
              language="javascript"
              id="vue-example"
            />
          </div>

          <input type="radio" name="framework_tabs" className="tab" aria-label="Angular" />
          <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className="text-xl font-semibold mb-4">Angular Integration</h3>
            <CodeBlock
              code={`// auth.service.ts
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
}`}
              language="typescript"
              id="angular-example"
            />
          </div>

          <input type="radio" name="framework_tabs" className="tab" aria-label="Node.js" />
          <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className="text-xl font-semibold mb-4">Node.js/Express Integration</h3>
            <CodeBlock
              code={`const express = require('express');
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
});`}
              language="javascript"
              id="nodejs-example"
            />
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Security Best Practices</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card bg-red-50 border border-red-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-red-900">❌ Don't Expose API Keys</h3>
              <CodeBlock
                code={`// Never do this in frontend code!
const config = {
  projectId: 'proj_123',
  apiKey: 'sk_live_abc123' // Visible to users!
};`}
                language="javascript"
                id="bad-security"
              />
            </div>
          </div>

          <div className="card bg-green-50 border border-green-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-green-900">✅ Use Environment Variables</h3>
              <CodeBlock
                code={`// Do this instead
const config = {
  projectId: process.env.REACT_APP_PROJECT_ID,
  // Keep API keys server-side only
};`}
                language="javascript"
                id="good-security"
              />
            </div>
          </div>
        </div>

        <div className="alert alert-warning mt-6">
          <div>
            <strong>Important:</strong> API keys should only be used in server-side code. For client-side applications, use only the project ID and implement a server-side proxy for API key authentication.
          </div>
        </div>
      </section>

      {/* Environment Configuration */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Environment Configuration</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Environment Variables</h3>
            <CodeBlock
              code={`# Frontend (.env)
REACT_APP_AUTH_PROJECT_ID=your-project-id

# Backend (.env)
AUTH_PROJECT_ID=your-project-id
AUTH_API_KEY=your-api-key
AUTH_BASE_URL=https://access-kit-server.vercel.app/api/project-users

# Next.js (.env.local)
NEXT_PUBLIC_AUTH_PROJECT_ID=your-project-id
AUTH_API_KEY=your-api-key  # Server-side only`}
              language="bash"
              id="env-config"
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Getting API Keys</h3>
            <div className="steps steps-vertical lg:steps-horizontal">
              <div className="step step-primary">
                <div className="step-content">
                  <h4 className="font-semibold">Visit Dashboard</h4>
                  <p className="text-sm">Go to <a href="https://access-kit-server.vercel.app" className="link">access-kit-server.vercel.app</a></p>
                </div>
              </div>
              <div className="step step-primary">
                <div className="step-content">
                  <h4 className="font-semibold">Create Project</h4>
                  <p className="text-sm">Set up a new project in your dashboard</p>
                </div>
              </div>
              <div className="step step-primary">
                <div className="step-content">
                  <h4 className="font-semibold">Copy Keys</h4>
                  <p className="text-sm">Get your Project ID and API Key from settings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TypeScript Support */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">TypeScript Support</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Type Definitions</h3>
            <p className="text-base-content/70 mb-4">
              Both SDKs include complete TypeScript definitions for excellent developer experience.
            </p>
            <CodeBlock
              code={`import { 
  AuthClient, 
  User, 
  AuthConfig, 
  LoginCredentials, 
  CreateUserData,
  AuthResponse 
} from '@gsarthak783/accesskit-auth';

import { useAuth, AuthProvider } from '@gsarthak783/accesskit-react';

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
  lastName: 'Doe'
};`}
              language="typescript"
              id="typescript"
            />
          </div>
        </div>
      </section>

      {/* Testing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Testing</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Unit Testing</h3>
            <CodeBlock
              code={`// Jest example
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
});`}
              language="javascript"
              id="testing"
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">React Testing</h3>
            <CodeBlock
              code={`// React Testing Library example
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@gsarthak783/accesskit-react';
import MyComponent from './MyComponent';

test('renders login form when not authenticated', () => {
  render(
    <AuthProvider config={{ projectId: 'test', apiKey: 'test' }}>
      <MyComponent />
    </AuthProvider>
  );

  expect(screen.getByText('Login')).toBeInTheDocument();
});`}
              language="javascript"
              id="react-testing"
            />
          </div>
        </div>
      </section>

      {/* Links and Resources */}
      <section className="mb-12">
        <div className="alert alert-info">
          <div>
            <h3 className="font-semibold">Resources & Support</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
              <a href="https://access-kit-server.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                Live Dashboard <ExternalLink size={16} />
              </a>
              <a href="https://npmjs.com/package/@gsarthak783/accesskit-auth" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Core SDK <ExternalLink size={16} />
              </a>
              <a href="https://npmjs.com/package/@gsarthak783/accesskit-react" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                React SDK <ExternalLink size={16} />
              </a>
              <a href="https://github.com/gsarthak783/Auth-app" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                GitHub <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SdkDocumentation; 