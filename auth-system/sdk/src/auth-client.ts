import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AuthConfig,
  TokenStorage,
  User,
  CreateUserData,
  LoginCredentials,
  UpdateUserData,
  AuthResponse,
  ApiResponse,
  AuthEvent,
  AuthEventData,
  PaginationOptions,
  PaginatedResponse,
  ExportOptions,
  ImportOptions,
  ExportData
} from './types';
import { LocalTokenStorage } from './storage';

type EventListener = (data: AuthEventData) => void;

export class AuthClient {
  private config: Required<AuthConfig>;
  private http: AxiosInstance;
  private storage: TokenStorage;
  private eventListeners: Map<AuthEvent, EventListener[]> = new Map();
  private refreshPromise: Promise<string> | null = null;

  constructor(config: AuthConfig, storage?: TokenStorage) {
    this.config = {
      baseUrl: 'https://access-kit-server.vercel.app/api/project-users',
      projectId: '',
      timeout: 10000,
      retryAttempts: 3,
      ...config
    };

    this.storage = storage || new LocalTokenStorage();
    this.http = this.createHttpClient();
    this.setupInterceptors();
  }

  /**
   * Create axios instance with default configuration
   */
  private createHttpClient(): AxiosInstance {
    return axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey
      }
    });
  }

  /**
   * Setup request/response interceptors for automatic token handling
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.http.interceptors.request.use((config) => {
      const token = this.storage.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor - handle token refresh
    this.http.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.http(originalRequest);
          } catch (refreshError) {
            this.logout();
            this.emit('error', { error: refreshError as Error, timestamp: Date.now() });
            throw refreshError;
          }
        }

        throw error;
      }
    );
  }

  /**
   * Event system for auth state changes
   */
  on(event: AuthEvent, listener: EventListener): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  off(event: AuthEvent, listener: EventListener): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: AuthEvent, data: AuthEventData): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  /**
   * Register a new user
   */
  async register(userData: CreateUserData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.http.post('/register', userData);
      
      if (response.data.success && response.data.accessToken) {
        this.storage.setAccessToken(response.data.accessToken);
        this.storage.setRefreshToken(response.data.refreshToken);
        
        this.emit('register', {
          user: response.data.user,
          timestamp: Date.now()
        });
      }

      return response.data;
    } catch (error: any) {
      const authError = new Error(error.response?.data?.message || 'Registration failed');
      this.emit('error', { error: authError, timestamp: Date.now() });
      throw authError;
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await this.http.post('/login', credentials);
      
      if (response.data.success && response.data.accessToken) {
        this.storage.setAccessToken(response.data.accessToken);
        this.storage.setRefreshToken(response.data.refreshToken);
        
        this.emit('login', {
          user: response.data.user,
          timestamp: Date.now()
        });
      }

      return response.data;
    } catch (error: any) {
      const authError = new Error(error.response?.data?.message || 'Login failed');
      this.emit('error', { error: authError, timestamp: Date.now() });
      throw authError;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await this.http.post('/logout');
    } catch (error) {
      // Ignore logout errors, clear tokens anyway
    } finally {
      this.storage.clearTokens();
      this.emit('logout', { timestamp: Date.now() });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.http.get('/profile');
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: UpdateUserData): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.http.put('/profile', userData);
      
      this.emit('profile_update', {
        user: response.data.data!,
        timestamp: Date.now()
      });

      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    // Prevent multiple concurrent refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const refreshToken = this.storage.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response: AxiosResponse<{ accessToken: string }> = await this.http.post('/refresh', {
        refreshToken
      });

      const newToken = response.data.accessToken;
      this.storage.setAccessToken(newToken);

      this.emit('token_refresh', { timestamp: Date.now() });

      return newToken;
    } catch (error: any) {
      this.storage.clearTokens();
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await this.http.post('/forgot-password', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await this.http.post('/reset-password', { token, password });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }

  /**
   * Verify email address
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await this.http.post('/verify-email', { token });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Email verification failed');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.storage.getAccessToken();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.storage.getAccessToken();
  }

  /**
   * Export user data (requires admin access)
   */
  async exportUsers(options: ExportOptions = {}): Promise<ExportData> {
    try {
      const response: AxiosResponse<ExportData> = await this.http.post('/export', options);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Export failed');
    }
  }

  /**
   * Import user data (requires admin access)
   */
  async importUsers(data: ExportData, options: ImportOptions = {}): Promise<ApiResponse> {
    try {
      const response: AxiosResponse<ApiResponse> = await this.http.post('/import', {
        data,
        options
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Import failed');
    }
  }

  /**
   * Get all users (admin only, with pagination)
   */
  async getUsers(options: PaginationOptions = {}): Promise<PaginatedResponse<User>> {
    try {
      const response: AxiosResponse<PaginatedResponse<User>> = await this.http.get('/users', {
        params: options
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
  }

  /**
   * Delete a user (admin only)
   */
  async deleteUser(userId: string): Promise<void> {
    try {
      await this.http.delete(`/users/${userId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }

  /**
   * Update user status (admin only)
   */
  async updateUserStatus(userId: string, isActive: boolean): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.http.patch(`/users/${userId}/status`, {
        isActive
      });
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user status');
    }
  }

  /**
   * Get user by ID (admin only)
   */
  async getUser(userId: string): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.http.get(`/users/${userId}`);
      return response.data.data!;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  }
} 