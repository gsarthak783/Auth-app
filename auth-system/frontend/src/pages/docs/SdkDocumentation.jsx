import React, { useState } from 'react';
import { Copy, Check, Code, Package, Zap, Settings, Users, Database } from 'lucide-react';
import DocsLayout from '../../components/Layout/DocsLayout';

const SdkDocumentation = () => {
  const [copiedCode, setCopiedCode] = useState('');
  const [activeTab, setActiveTab] = useState('installation');

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

  const tabs = [
    { id: 'installation', name: 'Installation', icon: Package },
    { id: 'basic-usage', name: 'Basic Usage', icon: Zap },
    { id: 'advanced', name: 'Advanced Features', icon: Settings },
    { id: 'admin', name: 'Admin Functions', icon: Users },
  ];

  return (
    <DocsLayout>
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Code className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-base-content">JavaScript SDK</h1>
          </div>
          <p className="text-xl text-base-content/70">
            Complete JavaScript/TypeScript SDK for AuthSystem. Works in browsers, Node.js, and React Native.
          </p>
        </div>

        {/* Features Overview */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-base-200 p-6 rounded-lg text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-base-content mb-2">Easy Setup</h3>
              <p className="text-sm text-base-content/70">One-line installation and simple configuration</p>
            </div>
            <div className="bg-base-200 p-6 rounded-lg text-center">
              <Code className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-base-content mb-2">TypeScript</h3>
              <p className="text-sm text-base-content/70">Full TypeScript support with type definitions</p>
            </div>
            <div className="bg-base-200 p-6 rounded-lg text-center">
              <Settings className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-base-content mb-2">Auto Refresh</h3>
              <p className="text-sm text-base-content/70">Automatic token refresh and retry logic</p>
            </div>
            <div className="bg-base-200 p-6 rounded-lg text-center">
              <Database className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-base-content mb-2">Multi Storage</h3>
              <p className="text-sm text-base-content/70">localStorage, cookies, or memory storage</p>
            </div>
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
        {activeTab === 'installation' && (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6">Installation & Setup</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Install via NPM</h3>
              <CodeBlock
                code="npm install @your-auth/sdk"
                language="bash"
                id="install-npm"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Install via Yarn</h3>
              <CodeBlock
                code="yarn add @your-auth/sdk"
                language="bash"
                id="install-yarn"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Basic Setup</h3>
              <CodeBlock
                code={`import { AuthClient } from '@your-auth/sdk';

// Initialize the client
const authClient = new AuthClient({
  apiKey: 'your-project-api-key',
  baseUrl: 'https://your-auth-service.com/api/project-users'
});

// Optional: Custom configuration
const authClient = new AuthClient({
  apiKey: 'your-project-api-key',
  baseUrl: 'https://your-auth-service.com/api/project-users',
  timeout: 10000,          // Request timeout in ms
  retryAttempts: 3         // Number of retry attempts
});`}
                language="javascript"
                id="basic-setup"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Environment Variables</h3>
              <CodeBlock
                code={`// .env
VITE_AUTH_API_KEY=your-project-api-key
VITE_AUTH_BASE_URL=https://your-auth-service.com/api/project-users

// In your code
const authClient = new AuthClient({
  apiKey: import.meta.env.VITE_AUTH_API_KEY,
  baseUrl: import.meta.env.VITE_AUTH_BASE_URL
});`}
                language="javascript"
                id="env-vars"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
              <h3 className="font-semibold text-amber-900 mb-3">⚠️ Security Note</h3>
              <p className="text-amber-800">
                Never expose your API key in frontend code for production apps. 
                Consider proxying requests through your backend or using environment variables.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'basic-usage' && (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6">Basic Usage</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">User Registration</h3>
              <CodeBlock
                code={`// Register a new user
const user = await authClient.register({
  email: 'user@example.com',
  password: 'securePassword123',
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',           // optional
  customFields: {                // optional
    company: 'Acme Corp',
    role: 'Developer'
  }
});

console.log('User registered:', user);`}
                language="javascript"
                id="register-user"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">User Login</h3>
              <CodeBlock
                code={`// Login user
const response = await authClient.login({
  email: 'user@example.com',
  password: 'securePassword123'
});

console.log('User:', response.user);
console.log('Access Token:', response.accessToken);

// Check if user is authenticated
if (authClient.isAuthenticated()) {
  console.log('User is logged in!');
}`}
                language="javascript"
                id="login-user"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Get User Profile</h3>
              <CodeBlock
                code={`// Get current user profile
const user = await authClient.getProfile();
console.log('Current user:', user);

// Access user properties
console.log('Email:', user.email);
console.log('Name:', user.firstName, user.lastName);
console.log('Custom fields:', user.customFields);`}
                language="javascript"
                id="get-profile"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Update Profile</h3>
              <CodeBlock
                code={`// Update user profile
const updatedUser = await authClient.updateProfile({
  firstName: 'Jane',
  lastName: 'Smith',
  displayName: 'Jane Smith',
  customFields: {
    company: 'New Company',
    role: 'Senior Developer',
    preferences: {
      newsletter: true,
      theme: 'dark'
    }
  }
});

console.log('Profile updated:', updatedUser);`}
                language="javascript"
                id="update-profile"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Logout</h3>
              <CodeBlock
                code={`// Logout user
await authClient.logout();
console.log('User logged out');

// Check authentication status
console.log('Is authenticated:', authClient.isAuthenticated()); // false`}
                language="javascript"
                id="logout-user"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Password Reset</h3>
              <CodeBlock
                code={`// Request password reset
await authClient.requestPasswordReset('user@example.com');
console.log('Password reset email sent');

// Reset password with token (from email)
await authClient.resetPassword('reset-token', 'newPassword123');
console.log('Password reset successful');`}
                language="javascript"
                id="password-reset"
              />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6">Advanced Features</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Event System</h3>
              <CodeBlock
                code={`// Listen for authentication events
authClient.on('login', (data) => {
  console.log('User logged in:', data.user);
  // Update UI, redirect, etc.
});

authClient.on('logout', () => {
  console.log('User logged out');
  // Clear user data, redirect to login
});

authClient.on('token_refresh', () => {
  console.log('Token refreshed automatically');
});

authClient.on('error', (data) => {
  console.error('Auth error:', data.error);
  // Handle authentication errors
});

// Remove event listeners
const handleLogin = (data) => console.log('Login:', data.user);
authClient.on('login', handleLogin);
authClient.off('login', handleLogin); // Remove listener`}
                language="javascript"
                id="event-system"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Custom Token Storage</h3>
              <CodeBlock
                code={`import { AuthClient, LocalTokenStorage, MemoryTokenStorage, CookieTokenStorage } from '@your-auth/sdk';

// Default: localStorage
const authClient = new AuthClient(config);

// Memory storage (SSR-friendly)
const memoryStorage = new MemoryTokenStorage();
const authClient = new AuthClient(config, memoryStorage);

// Cookie storage (more secure)
const cookieStorage = new CookieTokenStorage('myapp');
const authClient = new AuthClient(config, cookieStorage);

// Custom storage implementation
class CustomStorage {
  getAccessToken() {
    return sessionStorage.getItem('access_token');
  }
  
  setAccessToken(token) {
    sessionStorage.setItem('access_token', token);
  }
  
  getRefreshToken() {
    return sessionStorage.getItem('refresh_token');
  }
  
  setRefreshToken(token) {
    sessionStorage.setItem('refresh_token', token);
  }
  
  clearTokens() {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  }
}

const customStorage = new CustomStorage();
const authClient = new AuthClient(config, customStorage);`}
                language="javascript"
                id="custom-storage"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Error Handling</h3>
              <CodeBlock
                code={`// Try-catch for specific operations
try {
  const user = await authClient.login(credentials);
  console.log('Login successful:', user);
} catch (error) {
  if (error.message.includes('Invalid credentials')) {
    // Handle invalid login
    showError('Invalid email or password');
  } else if (error.message.includes('Account not verified')) {
    // Handle unverified account
    showVerificationPrompt();
  } else {
    // Handle other errors
    showError('Login failed. Please try again.');
  }
}

// Global error handling
authClient.on('error', (data) => {
  const error = data.error;
  
  if (error.message.includes('Network')) {
    showNetworkError();
  } else if (error.message.includes('401')) {
    redirectToLogin();
  } else {
    showGenericError(error.message);
  }
});`}
                language="javascript"
                id="error-handling"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Request Interceptors</h3>
              <CodeBlock
                code={`// Access the underlying HTTP client (axios)
const httpClient = authClient.http;

// Add custom request headers
httpClient.interceptors.request.use((config) => {
  config.headers['X-App-Version'] = '1.0.0';
  config.headers['X-Device-ID'] = getDeviceId();
  return config;
});

// Add custom response handling
httpClient.interceptors.response.use(
  (response) => {
    // Log successful requests
    console.log('API Request:', response.config.method, response.config.url);
    return response;
  },
  (error) => {
    // Custom error handling
    if (error.response?.status === 503) {
      showMaintenanceMessage();
    }
    return Promise.reject(error);
  }
);`}
                language="javascript"
                id="interceptors"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Email Verification</h3>
              <CodeBlock
                code={`// Verify email with token from email link
const verifyEmailFromUrl = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    try {
      await authClient.verifyEmail(token);
      console.log('Email verified successfully');
      // Redirect to success page or login
    } catch (error) {
      console.error('Email verification failed:', error);
      // Show error message
    }
  }
};

// Call on page load
verifyEmailFromUrl();`}
                language="javascript"
                id="email-verification"
              />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6">Admin Functions</h2>
            
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <p className="text-blue-800">
                <strong>Note:</strong> Admin functions require appropriate permissions. Currently, project owners have admin access.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Get All Users</h3>
              <CodeBlock
                code={`// Get users with pagination
const usersResponse = await authClient.getUsers({
  page: 1,
  limit: 50
});

console.log('Users:', usersResponse.data);
console.log('Pagination:', usersResponse.pagination);

// Search and filter users
const searchResults = await authClient.getUsers({
  page: 1,
  limit: 20,
  search: 'john',      // Search by name, email, username
  status: 'active'     // Filter by status
});

// Access pagination info
const { current, pages, total } = searchResults.pagination;
console.log(\`Page \${current} of \${pages} (total: \${total} users)\`);`}
                language="javascript"
                id="get-users"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">User Management</h3>
              <CodeBlock
                code={`// Get specific user
const user = await authClient.getUser('user-id-here');
console.log('User details:', user);

// Update user status
const updatedUser = await authClient.updateUserStatus('user-id-here', false);
console.log('User deactivated:', updatedUser);

// Reactivate user
const reactivatedUser = await authClient.updateUserStatus('user-id-here', true);
console.log('User reactivated:', reactivatedUser);

// Delete user (soft delete)
await authClient.deleteUser('user-id-here');
console.log('User deleted');`}
                language="javascript"
                id="user-management"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Export Users</h3>
              <CodeBlock
                code={`// Export all users as JSON
const exportData = await authClient.exportUsers({
  format: 'json',
  includeCustomFields: true
});

console.log('Exported users:', exportData.users);
console.log('Export metadata:', exportData.metadata);

// Export with date range filter
const filteredExport = await authClient.exportUsers({
  format: 'json',
  includeCustomFields: true,
  dateRange: {
    from: '2024-01-01',
    to: '2024-12-31'
  }
});

// Export as CSV (returns CSV string)
const csvData = await authClient.exportUsers({
  format: 'csv',
  includeCustomFields: false
});

// Download CSV file
const downloadCsv = (csvData) => {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = \`users-export-\${Date.now()}.csv\`;
  a.click();
  window.URL.revokeObjectURL(url);
};`}
                language="javascript"
                id="export-users"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Import Users</h3>
              <CodeBlock
                code={`// Import users from exported data
const importResult = await authClient.importUsers(exportData, {
  updateExisting: true,    // Update existing users
  skipInvalid: true       // Skip invalid records
});

console.log('Import results:', importResult.results);

// Check import results
const { imported, updated, skipped, errors } = importResult.results;
console.log(\`Imported: \${imported}, Updated: \${updated}, Skipped: \${skipped}\`);

if (errors.length > 0) {
  console.log('Import errors:', errors);
  errors.forEach(error => {
    console.log(\`Error with \${error.email}: \${error.error}\`);
  });
}

// Import from file upload
const handleFileImport = async (file) => {
  const text = await file.text();
  const data = JSON.parse(text);
  
  const result = await authClient.importUsers(data, {
    updateExisting: false,
    skipInvalid: true
  });
  
  console.log('File import completed:', result);
};`}
                language="javascript"
                id="import-users"
              />
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-base-content mb-4">Complete Admin Dashboard Example</h3>
              <CodeBlock
                code={`class UserDashboard {
  constructor(authClient) {
    this.authClient = authClient;
    this.users = [];
    this.currentPage = 1;
    this.totalPages = 1;
  }

  async loadUsers(page = 1, search = '') {
    try {
      const response = await this.authClient.getUsers({
        page,
        limit: 20,
        search
      });
      
      this.users = response.data;
      this.currentPage = response.pagination.current;
      this.totalPages = response.pagination.pages;
      
      this.renderUsers();
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  async toggleUserStatus(userId, currentStatus) {
    try {
      const newStatus = !currentStatus;
      await this.authClient.updateUserStatus(userId, newStatus);
      
      // Reload current page
      await this.loadUsers(this.currentPage);
      
      console.log(\`User \${newStatus ? 'activated' : 'deactivated'}\`);
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  }

  async exportAllUsers() {
    try {
      const exportData = await this.authClient.exportUsers({
        format: 'json',
        includeCustomFields: true
      });
      
      // Download as JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`users-export-\${Date.now()}.json\`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }

  renderUsers() {
    // Render users in your UI
    console.log(\`Showing \${this.users.length} users (Page \${this.currentPage} of \${this.totalPages})\`);
  }
}

// Usage
const dashboard = new UserDashboard(authClient);
dashboard.loadUsers();`}
                language="javascript"
                id="admin-dashboard"
              />
            </div>
          </div>
        )}

        {/* TypeScript Types */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-base-content mb-6">TypeScript Types</h2>
          <CodeBlock
            code={`// Main interfaces
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  customFields?: Record<string, any>;
  createdAt: string;
  lastLogin?: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  customFields?: Record<string, any>;
}

interface AuthConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
}

// Event types
type AuthEvent = 'login' | 'logout' | 'register' | 'token_refresh' | 'profile_update' | 'error';

interface AuthEventData {
  user?: User;
  error?: Error;
  timestamp: number;
}

// Export/Import types
interface ExportOptions {
  format?: 'json' | 'csv';
  includeCustomFields?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

interface ExportData {
  users: User[];
  metadata: {
    exportedAt: string;
    totalCount: number;
    projectId: string;
  };
}`}
            language="typescript"
            id="typescript-types"
          />
        </section>
      </div>
    </DocsLayout>
  );
};

export default SdkDocumentation; 