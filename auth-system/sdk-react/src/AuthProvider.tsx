import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthClient, User, AuthConfig, TokenStorage } from '@gsarthak783/accesskit-auth';

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
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<{ email: string; isVerified: boolean }>;
  reauthenticateWithCredential: (password: string) => Promise<{ authenticated: boolean; authenticatedAt: string }>;
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
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  config,
  storage
}) => {
  const [client] = useState(() => new AuthClient(config, storage));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = client.onAuthStateChange((user, isAuthenticated) => {
      setUser(user);
      setIsAuthenticated(isAuthenticated);
      setIsLoading(false);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [client]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await client.login({ email, password });
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
      await client.register(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await client.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    await client.updateProfile(userData);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    await client.updatePassword({ currentPassword, newPassword });
  };

  const updateEmail = async (newEmail: string, password: string) => {
    return await client.updateEmail({ newEmail, password });
  };

  const reauthenticateWithCredential = async (password: string) => {
    return await client.reauthenticateWithCredential({ password });
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
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    updateEmail,
    reauthenticateWithCredential,
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