import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Token management
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const API_KEY = 'api_key';

export const tokenManager = {
  getToken: () => Cookies.get(TOKEN_KEY),
  setToken: (token) => Cookies.set(TOKEN_KEY, token, { expires: 1 }), // 1 day
  removeToken: () => Cookies.remove(TOKEN_KEY),
  
  getRefreshToken: () => Cookies.get(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => Cookies.set(REFRESH_TOKEN_KEY, token, { expires: 7 }), // 7 days
  removeRefreshToken: () => Cookies.remove(REFRESH_TOKEN_KEY),
  
  getApiKey: () => Cookies.get(API_KEY),
  setApiKey: (key) => Cookies.set(API_KEY, key, { expires: 30 }), // 30 days
  removeApiKey: () => Cookies.remove(API_KEY),
  
  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(API_KEY);
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    const apiKey = tokenManager.getApiKey();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
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
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = tokenManager.getRefreshToken();
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
          
          tokenManager.setToken(accessToken);
          tokenManager.setRefreshToken(newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        tokenManager.clearAll();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API error handler
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        toast.error(data.message || 'Bad request');
        break;
      case 401:
        toast.error('Unauthorized access');
        break;
      case 403:
        toast.error('Access forbidden');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 409:
        toast.error(data.message || 'Conflict error');
        break;
      case 422:
        toast.error(data.message || 'Validation error');
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(data.message || 'An error occurred');
    }
  } else if (error.request) {
    toast.error('Network error. Please check your connection.');
  } else {
    toast.error('An unexpected error occurred');
  }
  
  return Promise.reject(error);
};

// Auth API functions
export const authAPI = {
  // Authentication
  signup: async (userData, apiKey) => {
    try {
      const response = await api.post('/auth/signup', userData, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  login: async (credentials, apiKey) => {
    try {
      const response = await api.post('/auth/login', credentials, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  logout: async (refreshToken) => {
    try {
      const response = await api.post('/auth/logout', { refreshToken });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  logoutAll: async () => {
    try {
      const response = await api.post('/auth/logout-all');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  refreshToken: async (refreshToken) => {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      throw error; // Don't show toast for refresh token errors
    }
  },
  
  // Profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  deleteAccount: async (password) => {
    try {
      const response = await api.delete('/auth/account', { data: { password } });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Password reset
  requestPasswordReset: async (email, apiKey) => {
    try {
      const response = await api.post('/auth/request-password-reset', { email }, {
        headers: { 'x-api-key': apiKey }
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Email verification
  verifyEmail: async (token, email) => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}&email=${email}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// Projects API functions
export const projectsAPI = {
  // Project CRUD
  create: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/projects', { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getById: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  update: async (projectId, projectData) => {
    try {
      const response = await api.put(`/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  delete: async (projectId) => {
    try {
      const response = await api.delete(`/projects/${projectId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Project statistics
  getStats: async (projectId) => {
    try {
      const response = await api.get(`/projects/${projectId}/stats`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Project users
  getUsers: async (projectId, params = {}) => {
    try {
      const response = await api.get(`/projects/${projectId}/users`, { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  addUser: async (projectId, userData) => {
    try {
      const response = await api.post(`/projects/${projectId}/users`, userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  removeUser: async (projectId, userId) => {
    try {
      const response = await api.delete(`/projects/${projectId}/users/${userId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  updateUserRole: async (projectId, userId, roleData) => {
    try {
      const response = await api.put(`/projects/${projectId}/users/${userId}/role`, roleData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // API key management
  regenerateKeys: async (projectId) => {
    try {
      const response = await api.post(`/projects/${projectId}/regenerate-keys`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

export default api;