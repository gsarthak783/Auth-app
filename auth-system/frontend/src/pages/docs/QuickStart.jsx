import React, { useState } from 'react';
import { Copy, Check, Terminal, Code, Download, ExternalLink } from 'lucide-react';

const QuickStart = () => {
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-base-content mb-4">
          Quick Start Guide
        </h1>
        <p className="text-lg sm:text-xl text-base-content/70 mb-6 px-2">
          Get started with AccessKit in minutes. Choose your integration method and start building!
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <a 
            href="https://npmjs.com/package/@gsarthak783/accesskit-auth" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <Download size={16} className="mr-1" />
            <span className="hidden sm:inline">Core SDK</span>
            <span className="sm:hidden">SDK</span>
          </a>
          <a 
            href="https://npmjs.com/package/@gsarthak783/accesskit-react" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            <Download size={16} className="mr-1" />
            <span className="hidden sm:inline">React SDK</span>
            <span className="sm:hidden">React</span>
          </a>
        </div>
      </div>

      {/* Step 1: Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Step 1: Installation</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* JavaScript/TypeScript SDK */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <Code size={20} />
                JavaScript/TypeScript SDK
              </h3>
              <p className="text-base-content/70 mb-4">
                Universal SDK for any JavaScript/TypeScript project. Works with React, Vue, Angular, Node.js, and more.
              </p>
              <CodeBlock
                code="npm install @gsarthak783/accesskit-auth"
                language="bash"
                id="install-js"
              />
              <div className="card-actions justify-end">
                <div className="badge badge-primary">Universal</div>
                <div className="badge badge-outline">TypeScript</div>
              </div>
            </div>
          </div>

          {/* React SDK */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <Terminal size={20} />
                React SDK
              </h3>
              <p className="text-base-content/70 mb-4">
                React-specific SDK with hooks, context provider, and ready-to-use components.
              </p>
              <CodeBlock
                code="npm install @gsarthak783/accesskit-react"
                language="bash"
                id="install-react"
              />
              <div className="card-actions justify-end">
                <div className="badge badge-secondary">React</div>
                <div className="badge badge-outline">Hooks</div>
              </div>
            </div>
          </div>
        </div>

        <div className="alert alert-info mt-6">
          <div>
            <strong>Note:</strong> The React SDK automatically includes the core SDK as a dependency.
          </div>
        </div>
      </section>

      {/* Step 2: Get API Keys */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Step 2: Get Your API Keys</h2>
        
        <div className="steps steps-vertical lg:steps-horizontal">
          <div className="step step-primary">
            <div className="step-content">
              <h3 className="font-semibold">Create Account</h3>
              <p className="text-sm text-base-content/70">
                Sign up at <a href="https://access-kit-server.vercel.app" className="link link-primary">access-kit-server.vercel.app</a>
              </p>
            </div>
          </div>
          <div className="step step-primary">
            <div className="step-content">
              <h3 className="font-semibold">Create Project</h3>
              <p className="text-sm text-base-content/70">
                Set up a new project in your dashboard
              </p>
            </div>
          </div>
          <div className="step step-primary">
            <div className="step-content">
              <h3 className="font-semibold">Copy Keys</h3>
              <p className="text-sm text-base-content/70">
                Get your Project ID and API Key from settings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: Quick Integration */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Step 3: Quick Integration</h2>

        <div className="tabs tabs-boxed mb-6">
          <input type="radio" name="integration_tabs" className="tab" aria-label="JavaScript" defaultChecked />
          <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className="text-xl font-semibold mb-4">JavaScript/TypeScript Integration</h3>
            <CodeBlock
              code={`import { AuthClient } from '@gsarthak783/accesskit-auth';

// Initialize the client
const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
});

// Register a new user
try {
  const user = await auth.register({
    email: 'user@example.com',
    password: 'securepassword',
    firstName: 'John',
    lastName: 'Doe'
  });
  console.log('User registered:', user);
} catch (error) {
  console.error('Registration failed:', error);
}

// Login user
try {
  const response = await auth.login({
    email: 'user@example.com',
    password: 'securepassword'
  });
  console.log('Login successful:', response.user);
} catch (error) {
  console.error('Login failed:', error);
}

// Check if user is authenticated
if (auth.isAuthenticated()) {
  const profile = await auth.getProfile();
  console.log('User profile:', profile);
}`}
              language="javascript"
              id="js-integration"
            />
          </div>

          <input type="radio" name="integration_tabs" className="tab" aria-label="React" />
          <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className="text-xl font-semibold mb-4">React Integration</h3>
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
      <button onClick={logout}>Logout</button>
    </div>
  );
}`}
              language="jsx"
              id="react-integration"
            />
          </div>

          <input type="radio" name="integration_tabs" className="tab" aria-label="Node.js" />
          <div className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <h3 className="text-xl font-semibold mb-4">Node.js Backend Integration</h3>
            <CodeBlock
              code={`const express = require('express');
const { AuthClient } = require('@gsarthak783/accesskit-auth');

const app = express();
const auth = new AuthClient({
  projectId: process.env.AUTH_PROJECT_ID,
  apiKey: process.env.AUTH_API_KEY
});

app.use(express.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const user = await auth.register(req.body);
    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const response = await auth.login(req.body);
    res.json({ success: true, user: response.user, token: response.accessToken });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Protected route
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Set token and get profile
    auth.setAccessToken(token);
    const profile = await auth.getProfile();
    res.json({ success: true, user: profile });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`}
              language="javascript"
              id="nodejs-integration"
            />
          </div>
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
REACT_APP_AUTH_PROJECT_ID=your-project-id

# For Node.js backend
AUTH_PROJECT_ID=your-project-id
AUTH_API_KEY=your-api-key
AUTH_BASE_URL=https://access-kit-server.vercel.app/api/project-users`}
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
        <h2 className="text-2xl font-semibold text-base-content mb-6">Next Steps</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">🔧 API Reference</h3>
              <p className="text-base-content/70">
                Explore all available methods and configurations.
              </p>
              <div className="card-actions justify-end">
                <a href="/docs/api-reference" className="btn btn-primary btn-sm">
                  View Docs
                </a>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">⚛️ React SDK</h3>
              <p className="text-base-content/70">
                Learn about React hooks and components.
              </p>
              <div className="card-actions justify-end">
                <a href="/docs/react-sdk" className="btn btn-primary btn-sm">
                  React Guide
                </a>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">📚 Examples</h3>
              <p className="text-base-content/70">
                See complete integration examples.
              </p>
              <div className="card-actions justify-end">
                <a href="/docs/sdk-documentation" className="btn btn-primary btn-sm">
                  View Examples
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help */}
      <section className="mb-12">
        <div className="alert alert-info">
          <div>
            <h3 className="font-semibold">Need Help?</h3>
            <p>
              Check out our <a href="/docs/api-reference" className="link link-primary">full documentation</a> or 
              visit our <a href="https://github.com/gsarthak783/Auth-app/issues" target="_blank" rel="noopener noreferrer" className="link link-primary">
                GitHub repository
              </a> for support.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickStart; 