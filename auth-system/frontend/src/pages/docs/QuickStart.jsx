import React, { useState } from 'react';
import { Copy, Check, Zap, Shield, Code, Globe, Users, Settings } from 'lucide-react';
import DocsLayout from '../../components/Layout/DocsLayout';

const QuickStart = () => {
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

  const CodeBlock = ({ code, language = 'javascript', id }) => (
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-base-content">Quick Start</h1>
          </div>
          <p className="text-xl text-base-content/70">
            Get up and running with AuthSystem in minutes. Add authentication to your app with just a few lines of code.
          </p>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">What is AuthSystem?</h2>
          <div className="bg-base-200 p-6 rounded-lg mb-6">
            <p className="text-base-content/80 mb-4">
              AuthSystem is a complete authentication service that provides user management, secure login/signup, 
              and project-based user isolation. It's designed to be developer-friendly with SDKs for popular frameworks.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm">Secure by default</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-primary" />
                <span className="text-sm">Easy integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm">REST API</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm">User management</span>
              </div>
            </div>
          </div>
        </section>

        {/* Step 1: Get Credentials */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Step 1: Get Your Credentials</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Create a Project</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Login to your AuthSystem dashboard</li>
                <li>Click "Create New Project"</li>
                <li>Enter your project name and configure settings</li>
                <li>Copy your API Key and Project ID</li>
              </ol>
            </div>
            
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-semibold text-base-content mb-2">Your Credentials</h3>
              <div className="space-y-2 font-mono text-sm">
                <div>API Key: <code className="bg-base-300 px-2 py-1 rounded">your-project-api-key</code></div>
                <div>Project ID: <code className="bg-base-300 px-2 py-1 rounded">your-project-id</code></div>
                <div>Base URL: <code className="bg-base-300 px-2 py-1 rounded">https://your-auth-service.com/api/project-users</code></div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Install SDK */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Step 2: Install SDK</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-base-200 p-6 rounded-lg">
              <h3 className="font-semibold text-base-content mb-3">For JavaScript/Node.js</h3>
              <CodeBlock
                code="npm install @your-auth/sdk"
                language="bash"
                id="install-js"
              />
            </div>
            
            <div className="bg-base-200 p-6 rounded-lg">
              <h3 className="font-semibold text-base-content mb-3">For React Projects</h3>
              <CodeBlock
                code="npm install @your-auth/react"
                language="bash"
                id="install-react"
              />
            </div>
          </div>
        </section>

        {/* Step 3: Basic Usage */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Step 3: Basic Usage</h2>
          
          {/* JavaScript Example */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">JavaScript/Node.js</h3>
            <CodeBlock
              code={`import { AuthClient } from '@your-auth/sdk';

// Initialize the client
const authClient = new AuthClient({
  apiKey: 'your-project-api-key',
  baseUrl: 'https://your-auth-service.com/api/project-users'
});

// Register a new user
const user = await authClient.register({
  email: 'user@example.com',
  password: 'securePassword123',
  firstName: 'John',
  lastName: 'Doe'
});

console.log('User registered:', user);

// Login
const loginResponse = await authClient.login({
  email: 'user@example.com',
  password: 'securePassword123'
});

console.log('Login successful:', loginResponse.user);

// Get current user profile
const profile = await authClient.getProfile();
console.log('Current user:', profile);

// Logout
await authClient.logout();`}
              language="javascript"
              id="js-example"
            />
          </div>

          {/* React Example */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-base-content mb-4">React</h3>
            <CodeBlock
              code={`import React from 'react';
import { AuthProvider, useAuth } from '@your-auth/react';

// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider
      config={{
        apiKey: 'your-project-api-key',
        baseUrl: 'https://your-auth-service.com/api/project-users'
      }}
    >
      <LoginPage />
    </AuthProvider>
  );
}

// Use authentication in your components
function LoginPage() {
  const { user, login, logout, isAuthenticated, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // User is now logged in!
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
      <h1>Please Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}`}
              language="jsx"
              id="react-example"
            />
          </div>
        </section>

        {/* Step 4: Configuration */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Step 4: Configuration</h2>
          
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-6">
            <h3 className="font-semibold text-amber-900 mb-3">⚠️ Important Security Notes</h3>
            <ul className="list-disc list-inside space-y-1 text-amber-800">
              <li>Never expose your API key in frontend code</li>
              <li>Use environment variables for sensitive configuration</li>
              <li>Always use HTTPS in production</li>
              <li>Configure CORS settings in your project dashboard</li>
            </ul>
          </div>

          <h3 className="text-xl font-semibold text-base-content mb-4">Environment Variables</h3>
          <CodeBlock
            code={`# .env
REACT_APP_AUTH_API_KEY=your-project-api-key
REACT_APP_AUTH_BASE_URL=https://your-auth-service.com/api/project-users

# For Node.js backend
AUTH_API_KEY=your-project-api-key
AUTH_BASE_URL=https://your-auth-service.com/api/project-users`}
            language="bash"
            id="env-vars"
          />

          <h3 className="text-xl font-semibold text-base-content mb-4 mt-6">CORS Configuration</h3>
          <p className="text-base-content/70 mb-4">
            In your project dashboard, add your domain to the allowed origins:
          </p>
          <div className="bg-base-200 p-4 rounded-lg">
            <div className="space-y-2 font-mono text-sm">
              <div>• <code>http://localhost:3000</code> (for development)</div>
              <div>• <code>https://yourapp.com</code> (for production)</div>
              <div>• <code>https://yourapp.vercel.app</code> (for Vercel deployments)</div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">🎉 You're All Set!</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-3">✅ What You've Accomplished</h3>
              <ul className="list-disc list-inside space-y-1 text-green-800">
                <li>Created your first project</li>
                <li>Installed the SDK</li>
                <li>Implemented basic authentication</li>
                <li>Configured security settings</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">🚀 Next Steps</h3>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Explore the <a href="/docs/api" className="underline">API Reference</a></li>
                <li>Check out <a href="/docs/examples" className="underline">Integration Examples</a></li>
                <li>Learn about <a href="/docs/features" className="underline">Advanced Features</a></li>
                <li>Review <a href="/docs/security" className="underline">Security Best Practices</a></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="bg-base-200 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold text-base-content mb-4">Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-base-content mb-2">📚 Documentation</h3>
              <p className="text-base-content/70 text-sm mb-2">
                Comprehensive guides and API reference
              </p>
              <a href="/docs/api" className="text-primary hover:underline text-sm">
                View API Docs →
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-base-content mb-2">💬 Community</h3>
              <p className="text-base-content/70 text-sm mb-2">
                Join our community for support and discussions
              </p>
              <a href="https://discord.gg/yourauth" className="text-primary hover:underline text-sm">
                Join Discord →
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-base-content mb-2">🐛 Issues</h3>
              <p className="text-base-content/70 text-sm mb-2">
                Report bugs or request features
              </p>
              <a href="https://github.com/yourusername/auth-system/issues" className="text-primary hover:underline text-sm">
                GitHub Issues →
              </a>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default QuickStart; 