import React, { useState } from 'react';
import { Copy, Check, Code, Database, Key, Shield, Users, Settings, ExternalLink } from 'lucide-react';

const ApiReference = () => {
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
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-base-content mb-4">
          API Reference
        </h1>
        <p className="text-xl text-base-content/70 mb-6">
          Complete reference for the AccessKit Authentication API and SDKs
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="badge badge-primary">Live API: access-kit-server.vercel.app</div>
          <div className="badge badge-secondary">REST API</div>
          <div className="badge badge-accent">JSON Responses</div>
        </div>
      </div>

      {/* Quick Links */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Quick Links</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="#authentication" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body text-center">
              <Shield size={32} className="mx-auto mb-2 text-primary" />
              <h3 className="card-title text-lg">Authentication</h3>
              <p className="text-sm text-base-content/70">Login & Register</p>
            </div>
          </a>
          <a href="#user-management" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body text-center">
              <Users size={32} className="mx-auto mb-2 text-secondary" />
              <h3 className="card-title text-lg">User Management</h3>
              <p className="text-sm text-base-content/70">Profile & Settings</p>
            </div>
          </a>
          <a href="#admin-endpoints" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body text-center">
              <Settings size={32} className="mx-auto mb-2 text-accent" />
              <h3 className="card-title text-lg">Admin API</h3>
              <p className="text-sm text-base-content/70">Management & Analytics</p>
            </div>
          </a>
          <a href="#sdk-reference" className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body text-center">
              <Code size={32} className="mx-auto mb-2 text-info" />
              <h3 className="card-title text-lg">SDK Reference</h3>
              <p className="text-sm text-base-content/70">JavaScript & React</p>
            </div>
          </a>
        </div>
      </section>

      {/* Base URL and Authentication */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6" id="base-url">Base URL & Authentication</h2>
        
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">API Base URL</h3>
          <CodeBlock
            code="https://access-kit-server.vercel.app"
            language="text"
            id="base-url-copy"
          />
        </div>

        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-6">
          <h3 className="font-semibold text-amber-900 mb-3">Required Headers</h3>
          <CodeBlock
            code={`Content-Type: application/json
X-API-Key: your-project-api-key
X-Project-ID: your-project-id
Authorization: Bearer {access_token}  // only for protected endpoints`}
            language="text"
            id="headers-copy"
          />
        </div>

        <div className="alert alert-info">
          <div>
            <strong>Getting API Keys:</strong> Visit <a href="https://access-kit-server.vercel.app" className="link link-primary" target="_blank" rel="noopener noreferrer">
              access-kit-server.vercel.app <ExternalLink size={16} className="inline" />
            </a> to create a project and get your API keys.
          </div>
        </div>
      </section>

      {/* Authentication Endpoints */}
      <section className="mb-12" id="authentication">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Authentication Endpoints</h2>

        {/* Register User */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-success">POST</span>
              Register User
            </h3>
            <p className="text-base-content/70 mb-4">Register a new user in your project</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="POST /api/project-users/register"
                language="text"
                id="register-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Request Body:</h4>
              <CodeBlock
                code={`{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",    // optional
  "customFields": {         // optional
    "role": "user",
    "department": "engineering"
  }
}`}
                language="json"
                id="register-request"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Response:</h4>
              <CodeBlock
                code={`{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "isVerified": true,
      "status": "active",
      "customFields": {
        "role": "user",
        "department": "engineering"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}`}
                language="json"
                id="register-response"
              />
            </div>
          </div>
        </div>

        {/* Login User */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-success">POST</span>
              Login User
            </h3>
            <p className="text-base-content/70 mb-4">Authenticate a user with email and password</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="POST /api/project-users/login"
                language="text"
                id="login-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Request Body:</h4>
              <CodeBlock
                code={`{
  "email": "user@example.com",
  "password": "securepassword"
}`}
                language="json"
                id="login-request"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Response:</h4>
              <CodeBlock
                code={`{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": true,
      "status": "active"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}`}
                language="json"
                id="login-response"
              />
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-success">POST</span>
              Logout User
            </h3>
            <p className="text-base-content/70 mb-4">Invalidate user session and tokens</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="POST /api/project-users/logout"
                language="text"
                id="logout-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Headers:</h4>
              <CodeBlock
                code={`X-API-Key: your-project-api-key
X-Project-ID: your-project-id
Authorization: Bearer {access_token} // optional for logout`}
                 language="text"
                 id="logout-headers"
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Management */}
      <section className="mb-12" id="user-management">
        <h2 className="text-2xl font-semibold text-base-content mb-6">User Management</h2>

        {/* Get Profile */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-info">GET</span>
              Get User Profile
            </h3>
            <p className="text-base-content/70 mb-4">Get the current user's profile information</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="GET /api/project-users/profile"
                language="text"
                id="profile-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Headers:</h4>
              <CodeBlock
                code={`X-API-Key: your-project-api-key
X-Project-ID: your-project-id
Authorization: Bearer {access_token}`}
                 language="text"
                 id="profile-headers"
              />
            </div>
          </div>
        </div>

        {/* Update Profile */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-warning">PUT</span>
              Update User Profile
            </h3>
            <p className="text-base-content/70 mb-4">Update user profile information</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="PUT /api/project-users/profile"
                language="text"
                id="update-profile-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Request Body:</h4>
              <CodeBlock
                code={`{
  "firstName": "Jane",
  "lastName": "Smith",
  "customFields": {
    "role": "admin",
    "bio": "Software Engineer"
  }
}`}
                language="json"
                id="update-profile-request"
              />
            </div>
          </div>
        </div>

        {/* Password Reset */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-success">POST</span>
              Request Password Reset
            </h3>
            <p className="text-base-content/70 mb-4">Send password reset email to user</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="POST /api/project-users/request-password-reset"
                language="text"
                id="reset-request-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Headers:</h4>
              <CodeBlock
                code={`X-API-Key: your-project-api-key  // OR provide X-Project-ID if API key cannot be sent
X-Project-ID: your-project-id`}
                language="text"
                id="reset-request-headers"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Request Body:</h4>
              <CodeBlock
                code={`{
  "email": "user@example.com"
}`}
                language="json"
                id="reset-request-body"
              />
            </div>
          </div>
        </div>

        {/* Reset Password */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-success">POST</span>
              Reset Password
            </h3>
            <p className="text-base-content/70 mb-4">Reset password using reset token</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="POST /api/project-users/reset-password"
                language="text"
                id="reset-password-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Headers:</h4>
              <CodeBlock
                code={`X-Project-ID: your-project-id`}
                language="text"
                id="reset-password-headers"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Request Body:</h4>
              <CodeBlock
                code={`{
  "token": "reset_token_from_email",
  "password": "newpassword123"
}`}
                language="json"
                id="reset-password-body"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Admin Endpoints */}
      <section className="mb-12" id="admin-endpoints">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Admin Endpoints</h2>
        
        <div className="alert alert-warning mb-6">
          <div>
            <strong>Note:</strong> Admin endpoints require your project API key and are intended for server-side use only.
          </div>
        </div>

        {/* Get All Users */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-info">GET</span>
              Get All Users
            </h3>
            <p className="text-base-content/70 mb-4">Get paginated list of all users in your project</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="GET /api/project-users?page=1&limit=50&search=john&status=active"
                language="text"
                id="get-users-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Query Parameters:</h4>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Type</th>
                      <th>Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>page</code></td>
                      <td>number</td>
                      <td>1</td>
                      <td>Page number for pagination</td>
                    </tr>
                    <tr>
                      <td><code>limit</code></td>
                      <td>number</td>
                      <td>20</td>
                      <td>Number of users per page (max 100)</td>
                    </tr>
                    <tr>
                      <td><code>search</code></td>
                      <td>string</td>
                      <td>-</td>
                      <td>Search users by email, name, or username</td>
                    </tr>
                    <tr>
                      <td><code>status</code></td>
                      <td>string</td>
                      <td>-</td>
                      <td>Filter by status: active, suspended, pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Get Statistics */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-info">GET</span>
              Get User Statistics
            </h3>
            <p className="text-base-content/70 mb-4">Get user analytics and statistics for your project</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="GET /api/project-users/stats"
                language="text"
                id="stats-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Response:</h4>
              <CodeBlock
                code={`{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 142,
    "suspendedUsers": 8,
    "newUsersToday": 5,
    "newUsersThisWeek": 23,
    "newUsersThisMonth": 67,
    "loginActivity": {
      "today": 45,
      "thisWeek": 128,
      "thisMonth": 398
    }
  }
}`}
                language="json"
                id="stats-response"
              />
            </div>
          </div>
        </div>

        {/* Delete User */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-error">DELETE</span>
              Delete User
            </h3>
            <p className="text-base-content/70 mb-4">Permanently delete a user from your project</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="DELETE /api/project-users/{userId}"
                language="text"
                id="delete-user-endpoint"
              />
            </div>

            <div className="alert alert-error">
              <div>
                <strong>Warning:</strong> This action is irreversible. The user and all associated data will be permanently deleted.
              </div>
            </div>
          </div>
        </div>

        {/* Update User Status */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">
              <span className="badge badge-warning">PATCH</span>
              Update User Status
            </h3>
            <p className="text-base-content/70 mb-4">Update a user's status (active, suspended, pending)</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Endpoint:</h4>
              <CodeBlock
                code="PATCH /api/project-users/{userId}/status"
                language="text"
                id="update-status-endpoint"
              />
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Request Body:</h4>
              <CodeBlock
                code={`{
  "status": "suspended"  // or "active", "pending"
}`}
                language="json"
                id="update-status-body"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SDK Reference */}
      <section className="mb-12" id="sdk-reference">
        <h2 className="text-2xl font-semibold text-base-content mb-6">SDK Reference</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* JavaScript SDK */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <Code size={20} />
                JavaScript/TypeScript SDK
              </h3>
              <p className="text-base-content/70 mb-4">
                Universal SDK for any JavaScript/TypeScript project
              </p>
              <CodeBlock
                code="npm install @gsarthak783/accesskit-auth"
                language="bash"
                id="install-js-sdk"
              />
              <div className="card-actions justify-end">
                <a 
                  href="https://npmjs.com/package/@gsarthak783/accesskit-auth" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-sm"
                >
                  View on npm <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* React SDK */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">
                <Database size={20} />
                React SDK
              </h3>
              <p className="text-base-content/70 mb-4">
                React hooks, context provider, and components
              </p>
              <CodeBlock
                code="npm install @gsarthak783/accesskit-react"
                language="bash"
                id="install-react-sdk"
              />
              <div className="card-actions justify-end">
                <a 
                  href="https://npmjs.com/package/@gsarthak783/accesskit-react" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                >
                  View on npm <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* JavaScript SDK Usage */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">JavaScript SDK Usage</h3>
            <CodeBlock
              code={`import { AuthClient } from '@gsarthak783/accesskit-auth';

const auth = new AuthClient({
  projectId: 'your-project-id',
  apiKey: 'your-api-key'
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

// Get profile
const profile = await auth.getProfile();

// Update profile
const updatedUser = await auth.updateProfile({
  firstName: 'Jane'
});

// Admin functions (require API key)
const users = await auth.getAllUsers({ page: 1, limit: 50 });
const stats = await auth.getStats();`}
              language="javascript"
              id="js-sdk-usage"
            />
          </div>
        </div>

        {/* React SDK Usage */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">React SDK Usage</h3>
            <CodeBlock
              code={`import { AuthProvider, useAuth } from '@gsarthak783/accesskit-react';

// Wrap your app
function App() {
  return (
    <AuthProvider config={{ projectId: 'your-project-id', apiKey: 'your-api-key' }}>
      <MyComponent />
    </AuthProvider>
  );
}

// Use in components
function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    register, 
    logout,
    updateProfile
  } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return (
      <button onClick={() => login('email@example.com', 'password')}>
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
              id="react-sdk-usage"
            />
          </div>
        </div>
      </section>

      {/* Error Handling */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Error Handling</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">HTTP Status Codes</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Status Code</th>
                    <th>Description</th>
                    <th>Common Causes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="badge badge-success">200</span></td>
                    <td>Success</td>
                    <td>Request completed successfully</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-error">400</span></td>
                    <td>Bad Request</td>
                    <td>Invalid request data, validation errors</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-error">401</span></td>
                    <td>Unauthorized</td>
                    <td>Invalid credentials, missing/expired token</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-error">403</span></td>
                    <td>Forbidden</td>
                    <td>Insufficient permissions, account suspended</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-error">404</span></td>
                    <td>Not Found</td>
                    <td>User or resource not found</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-error">409</span></td>
                    <td>Conflict</td>
                    <td>Email already exists, duplicate data</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-warning">429</span></td>
                    <td>Too Many Requests</td>
                    <td>Rate limit exceeded</td>
                  </tr>
                  <tr>
                    <td><span className="badge badge-error">500</span></td>
                    <td>Internal Server Error</td>
                    <td>Server-side error</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Error Response Format</h3>
            <CodeBlock
              code={`{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}`}
              language="json"
              id="error-format"
            />
          </div>
        </div>
      </section>

      {/* Rate Limiting */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Rate Limiting</h2>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Rate Limits</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Endpoint</th>
                    <th>Limit</th>
                    <th>Window</th>
                    <th>Scope</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Registration</td>
                    <td>5 requests</td>
                    <td>1 minute</td>
                    <td>Per IP</td>
                  </tr>
                  <tr>
                    <td>Login</td>
                    <td>10 requests</td>
                    <td>1 minute</td>
                    <td>Per IP</td>
                  </tr>
                  <tr>
                    <td>Password Reset</td>
                    <td>3 requests</td>
                    <td>1 hour</td>
                    <td>Per IP</td>
                  </tr>
                  <tr>
                    <td>General API</td>
                    <td>100 requests</td>
                    <td>1 minute</td>
                    <td>Per API Key</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Testing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-base-content mb-6">Testing the API</h2>

        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h3 className="card-title">Using cURL</h3>
            <CodeBlock
              code={`# Register a user
curl -X POST https://access-kit-server.vercel.app/api/project-users/register \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -H "X-Project-ID: your-project-id" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login user
curl -X POST https://access-kit-server.vercel.app/api/project-users/login \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -H "X-Project-ID: your-project-id" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'

# Request password reset (either API key or Project ID)
curl -X POST https://access-kit-server.vercel.app/api/project-users/request-password-reset \
  -H "Content-Type: application/json" \
  -H "X-Project-ID: your-project-id" \
  -d '{
    "email": "test@example.com"
  }'

# Reset password (project ID only)
curl -X POST https://access-kit-server.vercel.app/api/project-users/reset-password \
  -H "Content-Type: application/json" \
  -H "X-Project-ID: your-project-id" \
  -d '{
    "token": "reset_token_from_email",
    "password": "newpassword123"
  }'`}
              language="bash"
              id="curl-examples"
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Postman Collection</h3>
            <p className="text-base-content/70 mb-4">
              Import this basic collection structure into Postman for testing:
            </p>
            <CodeBlock
              code={`{
  "info": {
    "name": "AccessKit API",
    "description": "AccessKit Authentication API endpoints"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://access-kit-server.vercel.app"
    },
    {
      "key": "apiKey",
      "value": "your-api-key"
    },
    {
      "key": "projectId",
      "value": "your-project-id"
    }
  ]
}`}
              language="json"
              id="postman-collection"
            />
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="mb-12">
        <div className="alert alert-info">
          <div>
            <h3 className="font-semibold">Need Help?</h3>
            <p className="mb-2">
              For support, documentation, or to report issues:
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="https://access-kit-server.vercel.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                Dashboard <ExternalLink size={16} />
              </a>
              <a href="https://github.com/gsarthak783/Auth-app/issues" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                GitHub Issues <ExternalLink size={16} />
              </a>
              <a href="/docs/sdk-documentation" className="btn btn-outline btn-sm">
                SDK Documentation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApiReference; 