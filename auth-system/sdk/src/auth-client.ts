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
  ExportData,
  ChangePasswordData,
  UpdateEmailData,
  ReauthenticateData
} from './types';
import { LocalTokenStorage } from './storage';

type EventListener = (data: AuthEventData) => void;

export class AuthClient {
  private config: Required<AuthConfig>;
  private http: AxiosInstance;
  private storage: TokenStorage;
  private eventListeners: Map<AuthEvent, EventListener[]> = new Map();
  private refreshPromise: Promise<string> | null = null;
  private currentUser: User | null = null;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(config: AuthConfig, storage?: TokenStorage) {
    this.config = {
      baseUrl: 'https://access-kit-server.vercel.app/api/project-users',
      projectId: '',
      timeout: 10000,
      ...config
    };

    this.storage = storage || new LocalTokenStorage();
    this.http = this.createHttpClient();
    this.setupInterceptors();
    
    // Auto-initialize to check existing auth state
    this.initialize();
  }

  /**
   * Initialize auth state by checking stored tokens
   */
  private async initialize(): Promise<void> {
    if (this.initialized || this.initPromise) {
      return this.initPromise || Promise.resolve();
    }

    this.initPromise = (async () => {
      try {
        const token = this.storage.getAccessToken();
        if (token) {
          // Try to get user profile if token exists
          try {
            const user = await this.getProfile();
            this.currentUser = user;
            this.emit('authStateChange', { user, isAuthenticated: true, timestamp: Date.now() });
          } catch (error) {
            // Token might be expired, clear it
            this.storage.clearTokens();
            this.currentUser = null;
            this.emit('authStateChange', { user: undefined, isAuthenticated: false, timestamp: Date.now() });
          }
        } else {
          this.currentUser = null;
          this.emit('authStateChange', { user: undefined, isAuthenticated: false, timestamp: Date.now() });
        }
      } finally {
        this.initialized = true;
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }

  /**
   * Get the current authenticated user (from memory, no API call)
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated (has valid tokens)
   */
  isAuthenticated(): boolean {
    return !!this.storage.getAccessToken() && !!this.currentUser;
  }

  /**
   * Subscribe to auth state changes
   * Returns an unsubscribe function
   */
  onAuthStateChange(callback: (user: User | null, isAuthenticated: boolean) => void): () => void {
    // Ensure initialization has started
    this.initialize();

    const listener: EventListener = (data) => {
      if ('user' in data && 'isAuthenticated' in data) {
        callback(data.user as User | null, data.isAuthenticated as boolean);
      }
    };

    this.on('authStateChange', listener);

    // Immediately call with current state
    callback(this.currentUser, this.isAuthenticated());

    // Return unsubscribe function
    return () => {
      this.off('authStateChange', listener);
    };
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
        
        // Skip refresh for auth endpoints
        const authEndpoints = ['/login', '/register', '/logout', '/refresh', '/request-password-reset', '/reset-password'];
        const isAuthEndpoint = authEndpoints.some(endpoint => originalRequest?.url?.includes(endpoint));
        
        if (
          error.response?.status === 401 && 
          !originalRequest._retry && 
          !isAuthEndpoint
        ) {
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
        this.currentUser = response.data.user;
        
        this.emit('register', {
          user: response.data.user,
          timestamp: Date.now()
        });
        
        this.emit('authStateChange', {
          user: response.data.user,
          isAuthenticated: true,
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
        this.currentUser = response.data.user;
        
        this.emit('login', {
          user: response.data.user,
          timestamp: Date.now()
        });
        
        this.emit('authStateChange', {
          user: response.data.user,
          isAuthenticated: true,
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
      const refreshToken = this.storage.getRefreshToken();
      if (refreshToken) {
        await this.http.post('/logout', {}, {
          headers: {
            'X-Refresh-Token': refreshToken
          }
        });
      }
    } catch (error) {
      // Ignore logout errors, clear tokens anyway
    } finally {
      this.storage.clearTokens();
      this.currentUser = null;
      this.emit('logout', { timestamp: Date.now() });
      this.emit('authStateChange', { user: undefined, isAuthenticated: false, timestamp: Date.now() });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.http.get('/profile');
      
      if (response.data.success && response.data.data) {
        this.currentUser = response.data.data;
        return response.data.data;
      }
      
      throw new Error('Failed to get user profile');
    } catch (error: any) {
      const authError = new Error(error.response?.data?.message || 'Failed to get profile');
      this.emit('error', { error: authError, timestamp: Date.now() });
      throw authError;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateUserData): Promise<User> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.http.put('/profile', data);
      
      if (response.data.success && response.data.data) {
        this.currentUser = response.data.data;
        this.emit('profile_update', {
          user: response.data.data,
          timestamp: Date.now()
        });
        
        this.emit('authStateChange', {
          user: response.data.data,
          isAuthenticated: true,
          timestamp: Date.now()
        });
        
        return response.data.data;
      }
      
      throw new Error('Failed to update profile');
    } catch (error: any) {
      const authError = new Error(error.response?.data?.message || 'Failed to update profile');
      this.emit('error', { error: authError, timestamp: Date.now() });
      throw authError;
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
   * Update user password
   */
  async updatePassword(data: ChangePasswordData): Promise<void> {
    try {
      const response = await this.http.put('/change-password', data);
      
      // Password change invalidates all sessions, so clear tokens
      this.storage.clearTokens();
      this.currentUser = null;
      this.emit('logout', { timestamp: Date.now() });
      this.emit('authStateChange', { user: undefined, isAuthenticated: false, timestamp: Date.now() });
      
    } catch (error: any) {
      const authError = new Error(error.response?.data?.message || 'Password update failed');
      this.emit('error', { error: authError, timestamp: Date.now() });
      throw authError;
    }
  }

  /**
   * Update user email
   */
  async updateEmail(data: UpdateEmailData): Promise<{ email: string; isVerified: boolean }> {
    try {
      const response: AxiosResponse<ApiResponse<{ email: string; isVerified: boolean }>> = await this.http.put('/update-email', data);
      
      if (response.data.success && response.data.data) {
        // Update current user's email if we have the user object
        if (this.currentUser) {
          this.currentUser.email = response.data.data.email;
          this.currentUser.isVerified = response.data.data.isVerified;
          this.emit('profile_update', { user: this.currentUser, timestamp: Date.now() });
          this.emit('authStateChange', { user: this.currentUser, isAuthenticated: true, timestamp: Date.now() });
        }
        
        return response.data.data;
      }
      
      throw new Error('Failed to update email');
    } catch (error: any) {
      const authError = new Error(error.response?.data?.message || 'Email update failed');
      this.emit('error', { error: authError, timestamp: Date.now() });
      throw authError;
    }
  }

  /**
   * Reauthenticate user with credentials
   * This is useful for sensitive operations that require password confirmation
   */
  async reauthenticateWithCredential(data: ReauthenticateData): Promise<{ authenticated: boolean; authenticatedAt: string }> {
    try {
      const response: AxiosResponse<ApiResponse<{ authenticated: boolean; authenticatedAt: string }>> = await this.http.post('/reauthenticate', data);
      
      if (response.data.success && response.data.data) {
        this.emit('reauthenticate', { 
          user: this.currentUser || undefined, 
          timestamp: Date.now() 
        });
        
        return response.data.data;
      }
      
      throw new Error('Reauthentication failed');
    } catch (error: any) {
      const authError = new Error(error.response?.data?.message || 'Reauthentication failed');
      this.emit('error', { error: authError, timestamp: Date.now() });
      throw authError;
    }
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