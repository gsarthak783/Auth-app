import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { platformAuthAPI, tokenManager, utils } from '../utils/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_USER: 'CLEAR_USER',
  UPDATE_USER: 'UPDATE_USER',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case ActionTypes.CLEAR_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (utils.isAuthenticated()) {
          const response = await platformAuthAPI.getProfile();
          dispatch({
            type: ActionTypes.SET_USER,
            payload: response.data.user,
          });
        } else {
          dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        tokenManager.clearTokens();
        dispatch({ type: ActionTypes.CLEAR_USER });
      }
    };

    initializeAuth();
  }, []);

  // Platform user signup (no API key required)
  const signup = async (userData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      const response = await platformAuthAPI.register(userData);
      
      // Save tokens
      const { accessToken, refreshToken } = response.data.tokens;
      tokenManager.setTokens(accessToken, refreshToken);
      
      // Set user in state
      dispatch({
        type: ActionTypes.SET_USER,
        payload: response.data.user,
      });
      
      toast.success(response.message || 'Account created successfully!');
      return response;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Platform user login (no API key required)
  const login = async (credentials) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      const response = await platformAuthAPI.login(credentials);
      
      // Save tokens
      const { accessToken, refreshToken } = response.data.tokens;
      tokenManager.setTokens(accessToken, refreshToken);
      
      // Set user in state
      dispatch({
        type: ActionTypes.SET_USER,
        payload: response.data.user,
      });
      
      toast.success(response.message || 'Login successful!');
      return response;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken) {
        await platformAuthAPI.logout(refreshToken);
      }
      
      tokenManager.clearTokens();
      dispatch({ type: ActionTypes.CLEAR_USER });
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear tokens anyway
      tokenManager.clearTokens();
      dispatch({ type: ActionTypes.CLEAR_USER });
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      const response = await platformAuthAPI.updateProfile(profileData);
      
      dispatch({
        type: ActionTypes.UPDATE_USER,
        payload: response.data.user,
      });
      
      toast.success(response.message || 'Profile updated successfully');
      return response;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Refresh user data (useful after project creation/deletion)
  const refreshUser = async () => {
    try {
      const response = await platformAuthAPI.getProfile();
      dispatch({
        type: ActionTypes.UPDATE_USER,
        payload: response.data.user,
      });
      return response.data.user;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // Don't throw error as this is a background refresh
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const response = await platformAuthAPI.changePassword(passwordData);
      
      // Password change requires re-login for security
      tokenManager.clearTokens();
      dispatch({ type: ActionTypes.CLEAR_USER });
      
      toast.success(response.message || 'Password changed successfully. Please login again.');
      return response;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await platformAuthAPI.forgotPassword(email);
      toast.success(response.message || 'Password reset email sent');
      return response;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (resetData) => {
    try {
      const response = await platformAuthAPI.resetPassword(resetData);
      toast.success(response.message || 'Password reset successfully');
      return response;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Delete account
  const deleteAccount = async (password) => {
    try {
      const response = await platformAuthAPI.deleteAccount(password);
      
      tokenManager.clearTokens();
      dispatch({ type: ActionTypes.CLEAR_USER });
      
      toast.success(response.message || 'Account deleted successfully');
      return response;
    } catch (error) {
      const errorMessage = utils.getErrorMessage(error);
      toast.error(errorMessage);
      throw error;
    }
  };

  // Check if user can create more projects
  const canCreateProject = () => {
    if (!state.user) return false;
    const totalProjects = state.user.stats?.totalProjects || 0;
    const maxProjects = state.user.limits?.maxProjects || 5; // Updated default limit
    console.log('🔍 Project limit check:', { totalProjects, maxProjects, canCreate: totalProjects < maxProjects });
    return totalProjects < maxProjects;
  };

  // Get remaining project quota
  const getRemainingProjects = () => {
    if (!state.user) return 0;
    const totalProjects = state.user.stats?.totalProjects || 0;
    const maxProjects = state.user.limits?.maxProjects || 5;
    return Math.max(0, maxProjects - totalProjects);
  };

  // Get subscription info
  const getSubscriptionInfo = () => {
    if (!state.user) return null;
    return {
      plan: state.user.subscription?.plan || 'free',
      status: state.user.subscription?.status || 'active',
      limits: state.user.limits,
      stats: state.user.stats,
    };
  };

  // Context value
  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Authentication methods
    signup,
    login,
    logout,

    // Profile methods
    updateProfile,
    refreshUser,
    changePassword,
    forgotPassword,
    resetPassword,
    deleteAccount,

    // Utility methods
    canCreateProject,
    getRemainingProjects,
    getSubscriptionInfo,

    // Clear error
    clearError: () => dispatch({ type: ActionTypes.SET_ERROR, payload: null }),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;