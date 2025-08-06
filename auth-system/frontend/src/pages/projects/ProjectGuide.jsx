import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectsContext';
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  Code,
  Terminal,
  Book,
  ExternalLink,
  Download,
  Play,
  Globe,
  Key,
  Shield,
  Zap,
  Users,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProjectGuide = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, getProject, isLoading } = useProjects();
  
  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [activeTab, setActiveTab] = useState('javascript');
  const [copiedField, setCopiedField] = useState('');

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      await getProject(projectId);
    } catch (error) {
      console.error('Failed to load project:', error);
      navigate('/projects');
    }
  };

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success(`${field} copied to clipboard!`);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const maskApiKey = (key) => {
    if (!key) return '';
    return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4);
  };

  if (isLoading || !currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  const baseUrl = 'http://localhost:5000/api/project-users';

  const codeExamples = {
    javascript: {
      config: `// Configuration
const AUTH_CONFIG = {
  API_BASE_URL: '${baseUrl}',
  PROJECT_API_KEY: '${currentProject.apiKey}',
  PROJECT_ID: '${projectId}'
};`,
      
      register: `// User Registration
const registerUser = async (userData) => {
  const response = await fetch(\`\${AUTH_CONFIG.API_BASE_URL}/register\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY
    },
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    console.log('User registered:', result.user);
    return result;
  } else {
    throw new Error(result.message);
  }
};

// Usage
try {
  const result = await registerUser({
    email: 'user@example.com',
    password: 'securePassword123',
    firstName: 'John',
    lastName: 'Doe'
  });
  console.log('Registration successful!');
} catch (error) {
  console.error('Registration failed:', error.message);
}`,

      login: `// User Login
const loginUser = async (credentials) => {
  const response = await fetch(\`\${AUTH_CONFIG.API_BASE_URL}/login\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': AUTH_CONFIG.PROJECT_API_KEY
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Store tokens securely
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    localStorage.setItem('user', JSON.stringify(result.user));
    
    return result;
  } else {
    throw new Error(result.message);
  }
};

// Usage
try {
  const result = await loginUser({
    email: 'user@example.com',
    password: 'securePassword123'
  });
  console.log('Login successful:', result.user);
} catch (error) {
  console.error('Login failed:', error.message);
}`,

      authHook: `// React Authentication Hook
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        // Token invalid, try refresh
        try {
          await refreshAccessToken();
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (refreshError) {
          // Both tokens invalid
          localStorage.clear();
        }
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    const result = await loginUser(credentials);
    setUser(result.user);
    return result;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};`
    },

    python: {
      config: `# Configuration
import os
import requests

AUTH_CONFIG = {
    'API_BASE_URL': '${baseUrl}',
    'PROJECT_API_KEY': '${currentProject.apiKey}',
    'PROJECT_ID': '${projectId}'
}`,

      register: `# User Registration
def register_user(user_data):
    response = requests.post(
        f"{AUTH_CONFIG['API_BASE_URL']}/register",
        headers={
            'Content-Type': 'application/json',
            'X-API-Key': AUTH_CONFIG['PROJECT_API_KEY']
        },
        json={
            'email': user_data['email'],
            'password': user_data['password'],
            'firstName': user_data['firstName'],
            'lastName': user_data['lastName']
        }
    )
    
    result = response.json()
    
    if result.get('success'):
        print(f"User registered: {result['user']}")
        return result
    else:
        raise Exception(result.get('message', 'Registration failed'))

# Usage
try:
    result = register_user({
        'email': 'user@example.com',
        'password': 'securePassword123',
        'firstName': 'John',
        'lastName': 'Doe'
    })
    print('Registration successful!')
except Exception as e:
    print(f'Registration failed: {e}')`,

      login: `# User Login
def login_user(credentials):
    response = requests.post(
        f"{AUTH_CONFIG['API_BASE_URL']}/login",
        headers={
            'Content-Type': 'application/json',
            'X-API-Key': AUTH_CONFIG['PROJECT_API_KEY']
        },
        json={
            'email': credentials['email'],
            'password': credentials['password']
        }
    )
    
    result = response.json()
    
    if result.get('success'):
        # Store tokens securely (consider using secure storage)
        access_token = result['accessToken']
        refresh_token = result['refreshToken']
        user = result['user']
        
        return {
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user
        }
    else:
        raise Exception(result.get('message', 'Login failed'))

# Usage
try:
    result = login_user({
        'email': 'user@example.com',
        'password': 'securePassword123'
    })
    print(f'Login successful: {result["user"]}')
except Exception as e:
    print(f'Login failed: {e}')`,

      middleware: `# Flask Authentication Middleware
from functools import wraps
from flask import request, jsonify
import requests

def require_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not token:
            return jsonify({'message': 'No token provided'}), 401
        
        try:
            response = requests.get(
                f"{AUTH_CONFIG['API_BASE_URL']}/verify",
                headers={
                    'X-API-Key': AUTH_CONFIG['PROJECT_API_KEY'],
                    'Authorization': f'Bearer {token}'
                }
            )
            
            if response.json().get('success'):
                request.user = response.json().get('user')
                return f(*args, **kwargs)
            else:
                return jsonify({'message': 'Invalid token'}), 401
                
        except Exception as e:
            return jsonify({'message': 'Token verification failed'}), 401
    
    return decorated_function

# Usage in routes
@app.route('/protected')
@require_auth
def protected_route():
    return jsonify({'user': request.user})`
    },

    curl: {
      register: `# User Registration
curl -X POST "${baseUrl}/register" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${currentProject.apiKey}" \\
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'`,

      login: `# User Login
curl -X POST "${baseUrl}/login" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: ${currentProject.apiKey}" \\
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'`,

      profile: `# Get User Profile (requires token)
curl -X GET "${baseUrl}/profile" \\
  -H "X-API-Key: ${currentProject.apiKey}" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`
    }
  };

  const quickStartSteps = [
    {
      title: "Get Your Credentials",
      description: "Copy your API Key from the project dashboard",
      icon: Key,
      completed: true
    },
    {
      title: "Configure CORS",
      description: "Add your domain to allowed origins in project settings",
      icon: Globe,
      action: () => navigate(`/project/${projectId}/settings`)
    },
    {
      title: "Install Dependencies",
      description: "Add HTTP client library to your project",
      icon: Download
    },
    {
      title: "Implement Authentication",
      description: "Use the code examples below to add auth to your app",
      icon: Code
    },
    {
      title: "Test Integration",
      description: "Register a test user and verify login works",
      icon: Play
    }
  ];

  const endpoints = [
    { method: 'POST', path: '/register', description: 'Register new user' },
    { method: 'POST', path: '/login', description: 'User login' },
    { method: 'POST', path: '/logout', description: 'User logout' },
    { method: 'GET', path: '/profile', description: 'Get user profile' },
    { method: 'PUT', path: '/profile', description: 'Update user profile' },
    { method: 'POST', path: '/refresh', description: 'Refresh access token' },
    { method: 'POST', path: '/forgot-password', description: 'Request password reset' },
    { method: 'POST', path: '/reset-password', description: 'Reset password with token' },
    { method: 'POST', path: '/verify-email', description: 'Verify email address' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-base-content">Integration Guide</h1>
          <p className="text-base-content/60 mt-1">
            Step-by-step guide to integrate {currentProject.name} authentication
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/project/${projectId}/settings`}
            className="btn btn-outline btn-sm"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>

      {/* Project Credentials */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <h2 className="card-title">
            <Key className="w-5 h-5" />
            Project Credentials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">API Key</span>
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="btn btn-ghost btn-xs"
                >
                  {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  value={showApiKey ? currentProject.apiKey : maskApiKey(currentProject.apiKey)}
                  readOnly
                  className="input input-bordered flex-1 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(currentProject.apiKey, 'API Key')}
                  className="btn btn-square"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="label">
                <span className="label-text">Project ID</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  value={projectId}
                  readOnly
                  className="input input-bordered flex-1 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(projectId, 'Project ID')}
                  className="btn btn-square"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Steps */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <h2 className="card-title">
            <Zap className="w-5 h-5" />
            Quick Start Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {quickStartSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    step.completed ? 'bg-success text-success-content' : 'bg-base-200'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-sm">{step.title}</h3>
                  <p className="text-xs text-base-content/60 mt-1">{step.description}</p>
                  {step.action && (
                    <button
                      onClick={step.action}
                      className="btn btn-xs btn-primary mt-2"
                    >
                      Configure
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <h2 className="card-title">
            <Globe className="w-5 h-5" />
            Available Endpoints
          </h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((endpoint, index) => (
                  <tr key={index}>
                    <td>
                      <span className={`badge badge-sm ${
                        endpoint.method === 'GET' ? 'badge-info' :
                        endpoint.method === 'POST' ? 'badge-success' :
                        endpoint.method === 'PUT' ? 'badge-warning' :
                        'badge-error'
                      }`}>
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="font-mono text-sm">{baseUrl}{endpoint.path}</td>
                    <td>{endpoint.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">
            <Code className="w-5 h-5" />
            Integration Examples
          </h2>
          
          {/* Language Tabs */}
          <div className="tabs tabs-boxed mb-4">
            <button
              className={`tab ${activeTab === 'javascript' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('javascript')}
            >
              JavaScript
            </button>
            <button
              className={`tab ${activeTab === 'python' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('python')}
            >
              Python
            </button>
            <button
              className={`tab ${activeTab === 'curl' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('curl')}
            >
              cURL
            </button>
          </div>

          {/* Code Content */}
          <div className="space-y-6">
            {/* Configuration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Configuration</h3>
                <button
                  onClick={() => copyToClipboard(codeExamples[activeTab].config, 'Configuration')}
                  className="btn btn-ghost btn-xs"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <div className="mockup-code">
                <pre><code>{codeExamples[activeTab].config}</code></pre>
              </div>
            </div>

            {/* Registration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">User Registration</h3>
                <button
                  onClick={() => copyToClipboard(codeExamples[activeTab].register, 'Registration Code')}
                  className="btn btn-ghost btn-xs"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <div className="mockup-code">
                <pre><code>{codeExamples[activeTab].register}</code></pre>
              </div>
            </div>

            {/* Login */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">User Login</h3>
                <button
                  onClick={() => copyToClipboard(codeExamples[activeTab].login, 'Login Code')}
                  className="btn btn-ghost btn-xs"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <div className="mockup-code">
                <pre><code>{codeExamples[activeTab].login}</code></pre>
              </div>
            </div>

            {/* Additional Examples */}
            {activeTab === 'javascript' && codeExamples[activeTab].authHook && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">React Authentication Hook</h3>
                  <button
                    onClick={() => copyToClipboard(codeExamples[activeTab].authHook, 'Auth Hook')}
                    className="btn btn-ghost btn-xs"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <div className="mockup-code">
                  <pre><code>{codeExamples[activeTab].authHook}</code></pre>
                </div>
              </div>
            )}

            {activeTab === 'python' && codeExamples[activeTab].middleware && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Flask Middleware</h3>
                  <button
                    onClick={() => copyToClipboard(codeExamples[activeTab].middleware, 'Middleware Code')}
                    className="btn btn-ghost btn-xs"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <div className="mockup-code">
                  <pre><code>{codeExamples[activeTab].middleware}</code></pre>
                </div>
              </div>
            )}

            {activeTab === 'curl' && codeExamples[activeTab].profile && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Get User Profile</h3>
                  <button
                    onClick={() => copyToClipboard(codeExamples[activeTab].profile, 'Profile Code')}
                    className="btn btn-ghost btn-xs"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                </div>
                <div className="mockup-code">
                  <pre><code>{codeExamples[activeTab].profile}</code></pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security Notes */}
      <div className="alert alert-warning mt-6">
        <Shield className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Security Best Practices</h3>
          <div className="text-sm">
            <p>• Never expose API keys in frontend code - use environment variables</p>
            <p>• Always use HTTPS in production</p>
            <p>• Store tokens securely (httpOnly cookies recommended for sensitive apps)</p>
            <p>• Configure CORS settings in project settings</p>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="card bg-base-100 shadow-lg mt-6">
        <div className="card-body">
          <h2 className="card-title">
            <Book className="w-5 h-5" />
            Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Manage Users</h3>
              <p className="text-sm text-base-content/60 mb-2">View and manage authenticated users</p>
              <Link to={`/project/${projectId}/users`} className="btn btn-sm btn-outline">
                View Users
              </Link>
            </div>
            <div className="text-center">
              <Settings className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">Project Settings</h3>
              <p className="text-sm text-base-content/60 mb-2">Configure CORS, email templates</p>
              <Link to={`/project/${projectId}/settings`} className="btn btn-sm btn-outline">
                Settings
              </Link>
            </div>
            <div className="text-center">
              <ExternalLink className="w-8 h-8 mx-auto mb-2" />
              <h3 className="font-semibold">API Documentation</h3>
              <p className="text-sm text-base-content/60 mb-2">Complete API reference</p>
              <a
                href={`/api-docs?project=${projectId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline"
              >
                API Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectGuide; 