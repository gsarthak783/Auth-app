import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

// Create axios instance
const api = axios.create({
  baseURL:  'https://access-kit-server.vercel.app/api' ,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple rate limiter
const rateLimiter = {
  requests: new Map(),
  minInterval: 1000, // Minimum 1 second between identical requests
  
  canMakeRequest(key) {
    const now = Date.now();
    const lastRequest = this.requests.get(key);
    
    if (!lastRequest || now - lastRequest >= this.minInterval) {
      this.requests.set(key, now);
      return true;
    }
    
    return false;
  },
  
  clearOldRequests() {
    const now = Date.now();
    for (const [key, time] of this.requests.entries()) {
      if (now - time > 60000) { // Clear entries older than 1 minute
        this.requests.delete(key);
      }
    }
  }
};

// Clear old requests periodically
setInterval(() => rateLimiter.clearOldRequests(), 30000);

// Token management for platform users
export const tokenManager = {
  getAccessToken: () => Cookies.get('accessToken'),
  getRefreshToken: () => Cookies.get('refreshToken'),
  setTokens: (accessToken, refreshToken) => {
    if (accessToken) {
      Cookies.set('accessToken', accessToken, { 
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, { 
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
  },
  clearTokens: () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }
};

// Flag to prevent concurrent refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth header
api.interceptors.request.use(
  (config) => {
    // Rate limit check for sensitive endpoints
    if (config.url?.includes('/auth/refresh')) {
      const requestKey = `${config.method}:${config.url}`;
      if (!rateLimiter.canMakeRequest(requestKey)) {
        return Promise.reject(new Error('Too many requests. Please wait a moment.'));
      }
    }
    
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't intercept if no config (network errors, etc)
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Skip refresh logic for these cases:
    // 1. Project users endpoints (use API keys)
    // 2. The refresh endpoint itself
    // 3. Already retried requests
    const reqUrl = originalRequest.url || '';
    const isProjectUsersEndpoint = reqUrl.includes('/project-users');
    const isRefreshEndpoint = reqUrl.includes('/auth/refresh');
    const isLoginEndpoint = reqUrl.includes('/auth/login');
    
    if (isProjectUsersEndpoint || isRefreshEndpoint || isLoginEndpoint) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();
      
      if (!refreshToken) {
        isRefreshing = false;
        tokenManager.clearTokens();
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }

      try {
        const response = await api.post('/auth/refresh', {
          refreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        tokenManager.setTokens(accessToken, newRefreshToken || refreshToken);
        
        isRefreshing = false;
        processQueue(null, accessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed
        isRefreshing = false;
        processQueue(refreshError, null);
        tokenManager.clearTokens();
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Error handler
export const handleApiError = (error) => {
  if (error.response?.data?.message) {
    toast.error(error.response.data.message);
  } else if (error.message) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
  throw error;
};

// Platform Authentication API (for platform users)
export const platformAuthAPI = {
  // Register platform user (no API key required)
  register: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Login platform user (no API key required)
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Refresh token
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh', { refreshToken });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Logout
  logout: async (refreshToken) => {
    try {
      const data = refreshToken ? { refreshToken } : {};
      const response = await api.post('/auth/logout', data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Reset password
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      const response = await api.delete('/auth/account', {
        data: { password }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

// Projects API (for platform users managing projects)
export const projectsAPI = {
  // Get all user projects
  getProjects: async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get single project
  getProject: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Create project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get project statistics
  getProjectStats: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/stats`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Regenerate API keys
  regenerateApiKeys: async (projectId) => {
    try {
      const response = await api.post(`/projects/${projectId}/regenerate-keys`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Add team member
  addTeamMember: async (projectId, memberData) => {
    try {
      const response = await api.post(`/projects/${projectId}/team`, memberData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Remove team member
  removeTeamMember: async (projectId, memberId) => {
    try {
      const response = await api.delete(`/projects/${projectId}/team/${memberId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update team member role
  updateTeamMemberRole: async (projectId, memberId, role) => {
    try {
      const response = await api.put(`/projects/${projectId}/team/${memberId}`, { role });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

// Project Users API (for managing end-users of projects)
export const projectUsersAPI = {
  // Get all project users (admin only)
  getProjectUsers: async (apiKey, params = {}) => {
    try {
      const response = await api.get('/project-users', {
        headers: { 'x-api-key': apiKey },
        params
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Get project user statistics
  getProjectUserStats: async (apiKey) => {
    try {
      const response = await api.get('/project-users/stats', {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Delete project user
  deleteProjectUser: async (apiKey, userId) => {
    try {
      const response = await api.delete(`/project-users/${userId}`, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Update project user status
  updateProjectUserStatus: async (apiKey, userId, statusData) => {
    try {
      const response = await api.patch(`/project-users/${userId}/status`, statusData, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Register project user (requires API key)
  registerProjectUser: async (apiKey, userData) => {
    try {
      const response = await api.post('/project-users/register', userData, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Login project user (requires API key)
  loginProjectUser: async (apiKey, credentials) => {
    try {
      const response = await api.post('/project-users/login', credentials, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Request password reset email
  requestPasswordReset: async (apiKey, email) => {
    try {
      const response = await api.post('/project-users/request-password-reset', { email }, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Reset password with token
  resetPassword: async (apiKey, token, password) => {
    try {
      const response = await api.post('/project-users/reset-password', { token, password }, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Logout project user (invalidate refresh token)
  logout: async (apiKey, refreshToken) => {
    try {
      const response = await api.post('/project-users/logout', { refreshToken }, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  }
};

// Utility functions
export const utils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = tokenManager.getAccessToken();
    return !!token;
  },

  // Get current user info from token (basic decode)
  getCurrentUser: () => {
    const token = tokenManager.getAccessToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  },

  // Format API error message
  getErrorMessage: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.errors?.length > 0) {
      return error.response.data.errors[0].msg || error.response.data.errors[0];
    }
    return error.message || 'An unexpected error occurred';
  }
};

export default api;