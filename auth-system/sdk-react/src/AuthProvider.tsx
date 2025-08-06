import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient, User, AuthConfig, TokenStorage } from '@your-auth/sdk';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
    customFields?: Record<string, any>;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  client: AuthClient;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  config: AuthConfig;
  storage?: TokenStorage;
  autoInitialize?: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  config,
  storage,
  autoInitialize = true
}) => {
  const [client] = useState(() => new AuthClient(config, storage));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(autoInitialize);

  const initialize = async () => {
    if (!client.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      const userProfile = await client.getProfile();
      setUser(userProfile);
    } catch (error) {
      // Token might be invalid, clear it
      await client.logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (autoInitialize) {
      initialize();
    }

    // Set up event listeners
    const handleLogin = (data: any) => {
      setUser(data.user);
    };

    const handleRegister = (data: any) => {
      setUser(data.user);
    };

    const handleLogout = () => {
      setUser(null);
    };

    const handleProfileUpdate = (data: any) => {
      setUser(data.user);
    };

    const handleError = (data: any) => {
      console.error('Auth error:', data.error);
    };

    client.on('login', handleLogin);
    client.on('register', handleRegister);
    client.on('logout', handleLogout);
    client.on('profile_update', handleProfileUpdate);
    client.on('error', handleError);

    return () => {
      client.off('login', handleLogin);
      client.off('register', handleRegister);
      client.off('logout', handleLogout);
      client.off('profile_update', handleProfileUpdate);
      client.off('error', handleError);
    };
  }, [client, autoInitialize]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await client.login({ email, password });
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username?: string;
    customFields?: Record<string, any>;
  }) => {
    setIsLoading(true);
    try {
      const response = await client.register(userData);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await client.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    const updatedUser = await client.updateProfile(userData);
    setUser(updatedUser);
  };

  const requestPasswordReset = async (email: string) => {
    await client.requestPasswordReset(email);
  };

  const resetPassword = async (token: string, password: string) => {
    await client.resetPassword(token, password);
  };

  const verifyEmail = async (token: string) => {
    await client.verifyEmail(token);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    client
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 