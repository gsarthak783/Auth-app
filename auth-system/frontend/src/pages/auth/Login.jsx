import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    apiKey: 'ak_demo12345', // Default demo API key
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Get the page user was trying to visit or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.login.trim()) {
      newErrors.login = 'Email or username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API key is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await login(
        {
          login: formData.login.trim(),
          password: formData.password,
        },
        formData.apiKey.trim()
      );
      
      // Redirect to intended page or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      // Error handling is done in the auth context
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-base-content">Welcome back</h2>
          <p className="text-base-content/60 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* API Key Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Project API Key</span>
            </label>
            <input
              type="text"
              name="apiKey"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="Enter your project API key"
              className={`input input-bordered w-full ${errors.apiKey ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.apiKey && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.apiKey}
                </span>
              </label>
            )}
          </div>

          {/* Login Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email or Username</span>
            </label>
            <input
              type="text"
              name="login"
              value={formData.login}
              onChange={handleChange}
              placeholder="Enter your email or username"
              className={`input input-bordered w-full ${errors.login ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.login && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.login}
                </span>
              </label>
            )}
          </div>

          {/* Password Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`input input-bordered w-full pr-12 ${errors.password ? 'input-error' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-base-content/40" />
                ) : (
                  <Eye className="w-5 h-5 text-base-content/40" />
                )}
              </button>
            </div>
            {errors.password && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </span>
              </label>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              to="/auth/forgot-password" 
              className="link link-primary text-sm"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {/* Sign up link */}
        <div className="divider">OR</div>
        <div className="text-center">
          <span className="text-base-content/60">Don't have an account? </span>
          <Link to="/auth/signup" className="link link-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;