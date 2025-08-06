import React, { useState } from 'react';
import { Copy, Check, Globe, Shield, Users, Database, Key, Code } from 'lucide-react';
import DocsLayout from '../../components/Layout/DocsLayout';

const ApiReference = () => {
  const [copiedCode, setCopiedCode] = useState('');
  const [activeTab, setActiveTab] = useState('authentication');

  const copyToClipboard = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const CodeBlock = ({ code, language = 'bash', id }) => (
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

  const EndpointCard = ({ method, path, description, params, response, example }) => (
    <div className="bg-base-200 p-6 rounded-lg mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          method === 'GET' ? 'bg-blue-100 text-blue-800' :
          method === 'POST' ? 'bg-green-100 text-green-800' :
          method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
          method === 'PATCH' ? 'bg-purple-100 text-purple-800' :
          'bg-red-100 text-red-800'
        }`}>
          {method}
        </span>
        <code className="text-lg font-mono">{path}</code>
      </div>
      
      <p className="text-base-content/80 mb-4">{description}</p>
      
      {params && (
        <div className="mb-4">
          <h4 className="font-semibold text-base-content mb-2">Parameters</h4>
          <div className="bg-base-100 p-4 rounded border">
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-1">
                <code className="text-sm">{key}</code>
                <span className="text-sm text-base-content/70">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {response && (
        <div className="mb-4">
          <h4 className="font-semibold text-base-content mb-2">Response</h4>
          <CodeBlock
            code={JSON.stringify(response, null, 2)}
            language="json"
            id={`response-${method}-${path.replace(/[^a-zA-Z0-9]/g, '')}`}
          />
        </div>
      )}
      
      {example && (
        <div>
          <h4 className="font-semibold text-base-content mb-2">Example</h4>
          <CodeBlock
            code={example}
            language="bash"
            id={`example-${method}-${path.replace(/[^a-zA-Z0-9]/g, '')}`}
          />
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'authentication', name: 'Authentication', icon: Shield },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'admin', name: 'Admin Functions', icon: Key },
    { id: 'export', name: 'Export/Import', icon: Database },
  ];

  return (
    <DocsLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-base-content">API Reference</h1>
          </div>
          <p className="text-xl text-base-content/70">
            Complete REST API documentation for AuthSystem. All endpoints require authentication via API key.
          </p>
        </div>

        {/* Base URL */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-base-content mb-4">Base URL</h2>
          <div className="bg-base-200 p-4 rounded-lg">
            <code className="text-lg">https://your-auth-service.com/api/project-users</code>
          </div>
        </section>

        {/* Authentication */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-base-content mb-4">Authentication</h2>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <p className="text-blue-800 mb-4">
              All API requests require your project's API key in the header:
            </p>
            <CodeBlock
              code={`X-API-Key: your-project-api-key
Authorization: Bearer user-access-token  // For authenticated endpoints`}
              language="http"
              id="auth-headers"
            />
          </div>
        </section>

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'authentication' && (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6">Authentication Endpoints</h2>
            
            <EndpointCard
              method="POST"
              path="/register"
              description="Register a new user in your project"
              params={{
                email: "string (required) - User's email address",
                password: "string (required) - User's password",
                firstName: "string (required) - User's first name",
                lastName: "string (required) - User's last name",
                username: "string (optional) - Unique username",
                customFields: "object (optional) - Custom user data"
              }}
              response={{
                success: true,
                user: {
                  id: "64f1a2b3c4d5e6f7g8h9i0j1",
                  email: "user@example.com",
                  firstName: "John",
                  lastName: "Doe",
                  isVerified: false,
                  isActive: true,
                  createdAt: "2024-01-15T10:30:00.000Z"
                },
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                message: "User registered successfully"
              }}
              example={`curl -X POST "https://your-auth-service.com/api/project-users/register" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-project-api-key" \\
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'`}
            />

            <EndpointCard
              method="POST"
              path="/login"
              description="Authenticate a user and receive access tokens"
              params={{
                email: "string (required) - User's email address",
                password: "string (required) - User's password"
              }}
              response={{
                success: true,
                user: {
                  id: "64f1a2b3c4d5e6f7g8h9i0j1",
                  email: "user@example.com",
                  firstName: "John",
                  lastName: "Doe",
                  isVerified: true,
                  isActive: true,
                  lastLogin: "2024-01-15T10:30:00.000Z"
                },
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                message: "Login successful"
              }}
              example={`curl -X POST "https://your-auth-service.com/api/project-users/login" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-project-api-key" \\
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'`}
            />

            <EndpointCard
              method="POST"
              path="/logout"
              description="Invalidate user's access token and refresh token"
              response={{
                success: true,
                message: "Logout successful"
              }}
              example={`curl -X POST "https://your-auth-service.com/api/project-users/logout" \\
  -H "X-API-Key: your-project-api-key" \\
  -H "Authorization: Bearer your-access-token"`}
            />

            <EndpointCard
              method="POST"
              path="/refresh"
              description="Get a new access token using refresh token"
              params={{
                refreshToken: "string (required) - Valid refresh token"
              }}
              response={{
                success: true,
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                message: "Token refreshed successfully"
              }}
              example={`curl -X POST "https://your-auth-service.com/api/project-users/refresh" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-project-api-key" \\
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'`}
            />

            <EndpointCard
              method="POST"
              path="/forgot-password"
              description="Request password reset email"
              params={{
                email: "string (required) - User's email address"
              }}
              response={{
                success: true,
                message: "Password reset email sent"
              }}
              example={`curl -X POST "https://your-auth-service.com/api/project-users/forgot-password" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-project-api-key" \\
  -d '{
    "email": "user@example.com"
  }'`}
            />
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6">User Management</h2>
            
            <EndpointCard
              method="GET"
              path="/profile"
              description="Get current authenticated user's profile"
              response={{
                success: true,
                data: {
                  id: "64f1a2b3c4d5e6f7g8h9i0j1",
                  email: "user@example.com",
                  firstName: "John",
                  lastName: "Doe",
                  username: "johndoe",
                  displayName: "John Doe",
                  avatar: "https://example.com/avatar.jpg",
                  isVerified: true,
                  isActive: true,
                  customFields: {
                    company: "Acme Corp",
                    role: "Developer"
                  },
                  createdAt: "2024-01-15T10:30:00.000Z",
                  lastLogin: "2024-01-15T10:30:00.000Z"
                }
              }}
              example={`curl -X GET "https://your-auth-service.com/api/project-users/profile" \\
  -H "X-API-Key: your-project-api-key" \\
  -H "Authorization: Bearer your-access-token"`}
            />

            <EndpointCard
              method="PUT"
              path="/profile"
              description="Update current user's profile"
              params={{
                firstName: "string (optional) - User's first name",
                lastName: "string (optional) - User's last name",
                username: "string (optional) - Unique username",
                displayName: "string (optional) - Display name",
                avatar: "string (optional) - Avatar URL",
                customFields: "object (optional) - Custom user data"
              }}
              response={{
                success: true,
                data: {
                  id: "64f1a2b3c4d5e6f7g8h9i0j1",
                  email: "user@example.com",
                  firstName: "Jane",
                  lastName: "Doe",
                  username: "janedoe",
                  displayName: "Jane Doe",
                  avatar: "https://example.com/new-avatar.jpg",
                  isVerified: true,
                  isActive: true,
                  customFields: {
                    company: "New Company",
                    role: "Senior Developer"
                  },
                  updatedAt: "2024-01-15T11:00:00.000Z"
                },
                message: "Profile updated successfully"
              }}
              example={`curl -X PUT "https://your-auth-service.com/api/project-users/profile" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-project-api-key" \\
  -H "Authorization: Bearer your-access-token" \\
  -d '{
    "firstName": "Jane",
    "customFields": {
      "company": "New Company",
      "role": "Senior Developer"
    }
  }'`}
            />

            <EndpointCard
              method="POST"
              path="/verify-email"
              description="Verify user's email address with token"
              params={{
                token: "string (required) - Email verification token"
              }}
              response={{
                success: true,
                message: "Email verified successfully"
              }}
              example={`curl -X POST "https://your-auth-service.com/api/project-users/verify-email" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-project-api-key" \\
  -d '{
    "token": "verification-token-here"
  }'`}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6">Admin Functions</h2>
            
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
              <p className="text-amber-800">
                <strong>Note:</strong> These endpoints require admin privileges. Currently, all project owners have admin access.
              </p>
            </div>

            <EndpointCard
              method="GET"
              path="/users"
              description="Get all users in the project with pagination and filtering"
              params={{
                page: "number (optional) - Page number (default: 1)",
                limit: "number (optional) - Items per page (default: 50)",
                search: "string (optional) - Search by email, name, or username",
                status: "string (optional) - Filter by status: 'active' or 'inactive'"
              }}
              response={{
                success: true,
                data: [
                  {
                    id: "64f1a2b3c4d5e6f7g8h9i0j1",
                    email: "user1@example.com",
                    firstName: "John",
                    lastName: "Doe",
                    isVerified: true,
                    isActive: true,
                    createdAt: "2024-01-15T10:30:00.000Z",
                    lastLogin: "2024-01-15T10:30:00.000Z"
                  }
                ],
                pagination: {
                  current: 1,
                  pages: 5,
                  total: 247
                }
              }}
              example={`curl -X GET "https://your-auth-service.com/api/project-users/users?page=1&limit=10&search=john" \\
  -H "X-API-Key: your-project-api-key" \\
  -H "Authorization: Bearer your-access-token"`}
            />

            <EndpointCard
              method="DELETE"
              path="/users/{userId}"
              description="Delete a user (soft delete)"
              response={{
                success: true,
                message: "User deleted successfully"
              }}
              example={`curl -X DELETE "https://your-auth-service.com/api/project-users/users/64f1a2b3c4d5e6f7g8h9i0j1" \\
  -H "X-API-Key: your-project-api-key" \\
  -H "Authorization: Bearer your-access-token"`}
            />

            <EndpointCard
              method="PATCH"
              path="/users/{userId}/status"
              description="Update user status (activate/deactivate)"
              params={{
                isActive: "boolean (required) - User active status"
              }}
              response={{
                success: true,
                data: {
                  id: "64f1a2b3c4d5e6f7g8h9i0j1",
                  email: "user@example.com",
                  firstName: "John",
                  lastName: "Doe",
                  isActive: false,
                  updatedAt: "2024-01-15T11:00:00.000Z"
                },
                message: "User status updated successfully"
              }}
              example={`curl -X PATCH "https://your-auth-service.com/api/project-users/users/64f1a2b3c4d5e6f7g8h9i0j1/status" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-project-api-key" \\
  -H "Authorization: Bearer your-access-token" \\
  -d '{
    "isActive": false
  }'`}
            />
          </div>
        )}

        {activeTab === 'export' && (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6">Export/Import Functions</h2>
            
            <EndpointCard
              method="POST"
              path="/export"
              description="Export user data in JSON or CSV format"
              params={{
                format: "string (optional) - 'json' or 'csv' (default: 'json')",
                includeCustomFields: "boolean (optional) - Include custom fields (default: true)",
                dateRange: "object (optional) - { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }"
              }}
              response={{
                users: [
                  {
                    id: "64f1a2b3c4d5e6f7g8h9i0j1",
                    email: "user@example.com",
                    firstName: "John",
                    lastName: "Doe",
                    isVerified: true,
                    isActive: true,
                    customFields: {
                      company: "Acme Corp"
                    },
                    createdAt: "2024-01-15T10:30:00.000Z"
                  }
                ],
                metadata: {
                  exportedAt: "2024-01-15T12:00:00.000Z",
                  totalCount: 1,
                  projectId: "your-project-id",
                  format: "json"
                }
              }}
              example={`curl -X POST "https://your-auth-service.com/api/project-users/export" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-project-api-key" \\
  -H "Authorization: Bearer your-access-token" \\
  -d '{
    "format": "json",
    "includeCustomFields": true,
    "dateRange": {
      "from": "2024-01-01",
      "to": "2024-12-31"
    }
  }'`}
            />

            <EndpointCard
              method="POST"
              path="/import"
              description="Import user data from exported format"
              params={{
                data: "object (required) - Exported data object",
                options: "object (optional) - Import options",
                "options.updateExisting": "boolean (optional) - Update existing users (default: false)",
                "options.skipInvalid": "boolean (optional) - Skip invalid records (default: true)"
              }}
              response={{
                success: true,
                message: "Import completed",
                results: {
                  imported: 5,
                  updated: 2,
                  skipped: 1,
                  errors: [
                    {
                      email: "invalid@example.com",
                      error: "Email already exists"
                    }
                  ]
                }
              }}
              example={`curl -X POST "https://your-auth-service.com/api/project-users/import" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-project-api-key" \\
  -H "Authorization: Bearer your-access-token" \\
  -d '{
    "data": {
      "users": [...],
      "metadata": {...}
    },
    "options": {
      "updateExisting": true,
      "skipInvalid": true
    }
  }'`}
            />
          </div>
        )}

        {/* Error Codes */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Error Codes</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Description</th>
                  <th>Common Causes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>400</code></td>
                  <td>Bad Request</td>
                  <td>Invalid parameters, validation errors</td>
                </tr>
                <tr>
                  <td><code>401</code></td>
                  <td>Unauthorized</td>
                  <td>Missing or invalid API key, expired token</td>
                </tr>
                <tr>
                  <td><code>403</code></td>
                  <td>Forbidden</td>
                  <td>Insufficient permissions, account not verified</td>
                </tr>
                <tr>
                  <td><code>404</code></td>
                  <td>Not Found</td>
                  <td>User not found, invalid endpoint</td>
                </tr>
                <tr>
                  <td><code>429</code></td>
                  <td>Too Many Requests</td>
                  <td>Rate limit exceeded</td>
                </tr>
                <tr>
                  <td><code>500</code></td>
                  <td>Internal Server Error</td>
                  <td>Server error, database issues</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Rate Limits */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-base-content mb-6">Rate Limits</h2>
          <div className="bg-base-200 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-base-content mb-2">Authentication Endpoints</h3>
                <ul className="space-y-1 text-sm text-base-content/70">
                  <li>Register: 5 requests per 15 minutes</li>
                  <li>Login: 10 requests per 15 minutes</li>
                  <li>Password Reset: 3 requests per 15 minutes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-base-content mb-2">Other Endpoints</h3>
                <ul className="space-y-1 text-sm text-base-content/70">
                  <li>General: 100 requests per 15 minutes</li>
                  <li>Export: 10 requests per hour</li>
                  <li>Import: 5 requests per hour</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default ApiReference; 