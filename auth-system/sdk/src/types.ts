// User related types
export interface User {
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

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  customFields?: Record<string, any>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  username?: string;
  customFields?: Record<string, any>;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailData {
  newEmail: string;
  password: string;
}

export interface ReauthenticateData {
  password: string;
}

// Authentication responses
export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    needsVerification?: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// SDK Configuration
export interface AuthConfig {
  apiKey: string;
  baseUrl?: string;
  projectId?: string;
  timeout?: number;
}

// Token storage interface
export interface TokenStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  clearTokens(): void;
}

// Event types
export type AuthEvent = 
  | 'login'
  | 'logout'
  | 'register'
  | 'token_refresh'
  | 'profile_update'
  | 'error'
  | 'authStateChange'
  | 'reauthenticate';

export interface AuthEventData {
  user?: User;
  error?: Error;
  timestamp: number;
  isAuthenticated?: boolean;
}

// Pagination
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

// Export/Import types
export interface ExportOptions {
  format?: 'json' | 'csv';
  includeCustomFields?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}

export interface ImportOptions {
  format?: 'json' | 'csv';
  updateExisting?: boolean;
  skipInvalid?: boolean;
}

export interface ExportData {
  users: User[];
  metadata: {
    exportedAt: string;
    totalCount: number;
    projectId: string;
  };
} 