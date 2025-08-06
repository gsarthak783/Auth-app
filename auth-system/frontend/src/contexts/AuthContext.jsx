import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, tokenManager } from '../utils/api';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILURE: 'AUTH_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload.user },
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload.isLoading,
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

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = tokenManager.getToken();
      
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: { error: null } });
        return;
      }

      const response = await authAPI.getProfile();
      
      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: { user: response.user },
      });
    } catch (error) {
      tokenManager.clearAll();
      dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: { error: null } });
    }
  };

  const login = async (credentials, apiKey) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });

      const response = await authAPI.login(credentials, apiKey);
      
      if (response.success) {
        const { user, tokens } = response;
        
        // Store tokens
        tokenManager.setToken(tokens.accessToken);
        tokenManager.setRefreshToken(tokens.refreshToken);
        tokenManager.setApiKey(apiKey);

        dispatch({
          type: AUTH_ACTIONS.AUTH_SUCCESS,
          payload: { user },
        });

        toast.success(`Welcome back, ${user.firstName || user.username}!`);
        return response;
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: { error: error.message },
      });
      throw error;
    }
  };

  const signup = async (userData, apiKey) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });

      const response = await authAPI.signup(userData, apiKey);
      
      if (response.success) {
        const { user, tokens, needsVerification } = response;

        if (!needsVerification && tokens) {
          // Store tokens if user is verified
          tokenManager.setToken(tokens.accessToken);
          tokenManager.setRefreshToken(tokens.refreshToken);
          tokenManager.setApiKey(apiKey);

          dispatch({
            type: AUTH_ACTIONS.AUTH_SUCCESS,
            payload: { user },
          });

          toast.success(`Welcome, ${user.firstName || user.username}!`);
        } else {
          dispatch({ type: AUTH_ACTIONS.AUTH_FAILURE, payload: { error: null } });
          toast.success('Account created! Please check your email for verification.');
        }

        return response;
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: { error: error.message },
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearAll();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Logged out successfully');
    }
  };

  const logoutAll = async () => {
    try {
      await authAPI.logoutAll();
    } catch (error) {
      console.error('Logout all error:', error);
    } finally {
      tokenManager.clearAll();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      toast.success('Logged out from all devices');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        dispatch({
          type: AUTH_ACTIONS.UPDATE_PROFILE,
          payload: { user: response.user },
        });

        toast.success('Profile updated successfully');
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      
      if (response.success) {
        toast.success('Password changed successfully');
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async (password) => {
    try {
      const response = await authAPI.deleteAccount(password);
      
      if (response.success) {
        tokenManager.clearAll();
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        toast.success('Account deleted successfully');
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const requestPasswordReset = async (email, apiKey) => {
    try {
      const response = await authAPI.requestPasswordReset(email, apiKey);
      
      if (response.success) {
        toast.success('Password reset link sent to your email');
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (resetData) => {
    try {
      const response = await authAPI.resetPassword(resetData);
      
      if (response.success) {
        toast.success('Password reset successfully');
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (token, email) => {
    try {
      const response = await authAPI.verifyEmail(token, email);
      
      if (response.success) {
        toast.success('Email verified successfully');
        // Refresh user profile if authenticated
        if (state.isAuthenticated) {
          await checkAuthStatus();
        }
        return response;
      }
    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const setLoading = (isLoading) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { isLoading } });
  };

  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    signup,
    logout,
    logoutAll,
    updateProfile,
    changePassword,
    deleteAccount,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    checkAuthStatus,
    clearError,
    setLoading,
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