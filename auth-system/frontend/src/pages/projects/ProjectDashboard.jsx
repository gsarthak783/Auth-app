import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectsContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Users,
  BarChart3,
  Settings,
  Key,
  Code,
  Shield,
  Globe,
  Calendar,
  Activity,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Download,
  Book,
  Zap
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    currentProject,
    getProject,
    getProjectStats,
    regenerateApiKeys,
    isLoading
  } = useProjects();

  const [showApiKey, setShowApiKey] = useState(false);
  const [showApiSecret, setShowApiSecret] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      await getProject(projectId);
      await loadStats();
    } catch (error) {
      console.error('Failed to load project:', error);
      navigate('/projects');
    }
  };

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const projectStats = await getProjectStats(projectId);
      setStats(projectStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleRegenerateKeys = async () => {
    if (window.confirm('Are you sure you want to regenerate API keys? This will invalidate the current keys.')) {
      try {
        await regenerateApiKeys(projectId);
        toast.success('API keys regenerated successfully');
      } catch (error) {
        toast.error('Failed to regenerate API keys');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    return status ? 'text-success' : 'text-error';
  };

  if (isLoading || !currentProject) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const codeExamples = {
    javascript: `// Install the AuthSystem SDK
npm install @authsystem/client

// Initialize the client
import AuthSystem from '@authsystem/client';

const auth = new AuthSystem({
  apiKey: '${currentProject.apiKey}',
  baseURL: '${window.location.origin}/api'
});

// Register a new user
const registerUser = async (userData) => {
  try {
    const response = await auth.register({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName
    });
    console.log('User registered:', response.user);
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
  }
};

// Login user
const loginUser = async (credentials) => {
  try {
    const response = await auth.login({
      email: credentials.email,
      password: credentials.password
    });
    console.log('User logged in:', response.user);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
  }
};`,

    curl: `# Register a new user
curl -X POST "${window.location.origin}/api/project-users/register" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${currentProject.apiKey}" \\
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login user
curl -X POST "${window.location.origin}/api/project-users/login" \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: ${currentProject.apiKey}" \\
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'`,

    react: `// React Hook for AuthSystem
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = '${window.location.origin}/api/project-users';
  const API_KEY = '${currentProject.apiKey}';

  const register = async (userData) => {
    const response = await fetch(\`\${API_BASE}/register\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  };

  const login = async (credentials) => {
    const response = await fetch(\`\${API_BASE}/login\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(credentials)
    });
    
    if (!response.ok) throw new Error('Login failed');
    const data = await response.json();
    setUser(data.data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, register, login, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);`
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-base-content">{currentProject.name}</h1>
            <div className={`badge ${currentProject.isActive ? 'badge-success' : 'badge-error'}`}>
              {currentProject.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
          <p className="text-base-content/60 mt-1">
            {currentProject.description || 'No description provided'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/project/${projectId}/guide`}
            className="btn btn-primary btn-sm"
          >
            <Book className="w-4 h-4" />
            Integration Guide
          </Link>
          <Link
            to={`/project/${projectId}/settings`}
            className="btn btn-outline btn-sm"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${selectedTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Overview
        </a>
        <a
          className={`tab ${selectedTab === 'integration' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('integration')}
        >
          <Code className="w-4 h-4 mr-2" />
          Integration
        </a>
        <a
          className={`tab ${selectedTab === 'quickstart' ? 'tab-active' : ''}`}
          onClick={() => setSelectedTab('quickstart')}
        >
          <Zap className="w-4 h-4 mr-2" />
          Quick Start
        </a>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value text-primary">
                {statsLoading ? '...' : (stats?.totalUsers || 0)}
              </div>
              <div className="stat-desc">
                {statsLoading ? '...' : (stats?.usersToday || 0)} today
              </div>
            </div>

            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-figure text-secondary">
                <Activity className="w-8 h-8" />
              </div>
              <div className="stat-title">Active Users</div>
              <div className="stat-value text-secondary">
                {statsLoading ? '...' : (stats?.activeUsers || 0)}
              </div>
              <div className="stat-desc">
                {statsLoading ? '...' : (stats?.usersThisWeek || 0)} this week
              </div>
            </div>

            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-figure text-accent">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="stat-title">Verified Users</div>
              <div className="stat-value text-accent">
                {statsLoading ? '...' : (stats?.verifiedUsers || 0)}
              </div>
              <div className="stat-desc">
                {statsLoading ? '...' : Math.round(((stats?.verifiedUsers || 0) / (stats?.totalUsers || 1)) * 100)}% verified
              </div>
            </div>

            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-figure text-warning">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="stat-title">Suspended</div>
              <div className="stat-value text-warning">
                {statsLoading ? '...' : (stats?.suspendedUsers || 0)}
              </div>
              <div className="stat-desc">Suspended accounts</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">Quick Actions</h3>
                <div className="space-y-2">
                  <Link
                    to={`/project/${projectId}/guide`}
                    className="btn btn-primary btn-sm justify-start w-full"
                  >
                    <Book className="w-4 h-4 mr-2" />
                    Integration Guide
                  </Link>
                  <Link
                    to={`/project/${projectId}/users`}
                    className="btn btn-ghost btn-sm justify-start w-full"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Link>
                  <Link
                    to={`/project/${projectId}/analytics`}
                    className="btn btn-ghost btn-sm justify-start w-full"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Link>
                  <Link
                    to={`/project/${projectId}/settings`}
                    className="btn btn-ghost btn-sm justify-start w-full"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Project Settings
                  </Link>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title">Project Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Created:</span>
                    <span>{formatDate(currentProject.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Last Updated:</span>
                    <span>{formatDate(currentProject.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Status:</span>
                    <span className={getStatusColor(currentProject.isActive)}>
                      {currentProject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Signup:</span>
                    <span className={getStatusColor(currentProject.settings?.allowSignup)}>
                      {currentProject.settings?.allowSignup ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Email Verification:</span>
                    <span className={getStatusColor(currentProject.settings?.requireEmailVerification)}>
                      {currentProject.settings?.requireEmailVerification ? 'Required' : 'Optional'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Integration Tab */}
      {selectedTab === 'integration' && (
        <div className="space-y-6">
          {/* API Keys Section */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  API Keys
                </h3>
                <button
                  onClick={handleRegenerateKeys}
                  className="btn btn-outline btn-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Regenerate
                </button>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">API Key (Public)</span>
                    <span className="label-text-alt">Use this in your frontend applications</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentProject.apiKey}
                      readOnly
                      className="input input-bordered flex-1 font-mono text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(currentProject.apiKey, 'API Key')}
                      className="btn btn-outline btn-sm"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">API Secret (Private)</span>
                    <span className="label-text-alt">Keep this secret! Use only in backend applications</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showApiSecret ? 'text' : 'password'}
                      value={currentProject.apiSecret}
                      readOnly
                      className="input input-bordered flex-1 font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowApiSecret(!showApiSecret)}
                      className="btn btn-outline btn-sm"
                    >
                      {showApiSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(currentProject.apiSecret, 'API Secret')}
                      className="btn btn-outline btn-sm"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="alert alert-warning mt-4">
                <AlertTriangle className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">Security Notice</h3>
                  <p className="text-sm">
                    Never expose your API secret in frontend code. Use environment variables and keep it secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Endpoints Section */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title flex items-center gap-2">
                <Globe className="w-5 h-5" />
                API Endpoints
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Authentication</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-primary badge-sm">POST</span>
                        <code>/api/project-users/register</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-primary badge-sm">POST</span>
                        <code>/api/project-users/login</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-secondary badge-sm">GET</span>
                        <code>/api/project-users/profile</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-warning badge-sm">PUT</span>
                        <code>/api/project-users/profile</code>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Management (Admin)</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-secondary badge-sm">GET</span>
                        <code>/api/project-users</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-secondary badge-sm">GET</span>
                        <code>/api/project-users/stats</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-error badge-sm">DELETE</span>
                        <code>/api/project-users/:id</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="badge badge-warning badge-sm">PATCH</span>
                        <code>/api/project-users/:id/status</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm">
                  <strong>Base URL:</strong> <code className="bg-base-200 px-2 py-1 rounded">{window.location.origin}</code>
                </div>
              </div>
            </div>
          </div>

          {/* Allowed Origins */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Allowed Origins</h3>
              <div className="space-y-2">
                {currentProject.allowedOrigins?.map((origin, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <code className="text-sm">{origin}</code>
                  </div>
                ))}
              </div>
              <p className="text-sm text-base-content/60 mt-2">
                Only requests from these origins will be accepted by your API.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Start Tab */}
      {selectedTab === 'quickstart' && (
        <div className="space-y-6">
          <div className="alert alert-info">
            <Book className="w-5 h-5" />
            <div>
              <h3 className="font-semibold">Quick Start Guide</h3>
              <p className="text-sm">
                Get started with integrating AuthSystem into your application in minutes.
              </p>
            </div>
          </div>

          {/* Code Examples */}
          <div className="space-y-6">
            {/* JavaScript SDK */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title">JavaScript/Node.js</h3>
                  <button
                    onClick={() => copyToClipboard(codeExamples.javascript, 'JavaScript code')}
                    className="btn btn-outline btn-sm"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
                <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.javascript}</code>
                </pre>
              </div>
            </div>

            {/* React Hook */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title">React Hook</h3>
                  <button
                    onClick={() => copyToClipboard(codeExamples.react, 'React code')}
                    className="btn btn-outline btn-sm"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
                <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.react}</code>
                </pre>
              </div>
            </div>

            {/* cURL Examples */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title">cURL Examples</h3>
                  <button
                    onClick={() => copyToClipboard(codeExamples.curl, 'cURL commands')}
                    className="btn btn-outline btn-sm"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
                <pre className="bg-base-200 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples.curl}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title">Next Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Test your integration</h4>
                    <p className="text-sm text-base-content/60">Use the provided code examples to test user registration and login.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Configure settings</h4>
                    <p className="text-sm text-base-content/60">Customize authentication settings, email templates, and security options.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Monitor users</h4>
                    <p className="text-sm text-base-content/60">Use the user management interface to monitor and manage your application's users.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;