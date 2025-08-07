// Main exports for @gsarthak783/accesskit-react
export { AuthProvider, useAuth } from './AuthProvider';

// Export components if they exist
export { LoginForm } from './components/LoginForm';

// Re-export types from the core SDK for convenience
export type { 
  User, 
  AuthConfig, 
  TokenStorage, 
  LoginCredentials, 
  CreateUserData,
  UpdateUserData,
  AuthResponse,
  ApiResponse
} from '@gsarthak783/accesskit-auth'; 