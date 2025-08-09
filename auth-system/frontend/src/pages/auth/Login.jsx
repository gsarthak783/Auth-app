import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, AlertCircle, Mail, User } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const Login = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username
    password: '',
    rememberMe: false,
  });
  const [loginType, setLoginType] = useState('email'); // 'email' or 'username'
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = `${loginType === 'email' ? 'Email' : 'Username'} is required`;
    } else if (loginType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.identifier)) {
      newErrors.identifier = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const credentials = {
        password: formData.password,
      };

      // Set email or username based on login type
      if (loginType === 'email') {
        credentials.email = formData.identifier.trim();
      } else {
        credentials.username = formData.identifier.trim();
      }

      await login(credentials);
      
      // Redirect to dashboard on successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Error handling is done in the auth context
    }
  };

  const toggleLoginType = () => {
    setLoginType(prev => prev === 'email' ? 'username' : 'email');
    setFormData(prev => ({ ...prev, identifier: '' }));
    setErrors({});
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-base-content">Welcome Back</h2>
          <p className="text-base-content/60 mt-2">
            Sign in to your AuthSystem account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Login Type Toggle */}
          <div className="flex justify-center mb-4">
            <div className="btn-group">
              <button
                type="button"
                className={`btn btn-sm ${loginType === 'email' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setLoginType('email')}
              >
                <Mail className="w-4 h-4 mr-1" />
                Email
              </button>
              <button
                type="button"
                className={`btn btn-sm ${loginType === 'username' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setLoginType('username')}
              >
                <User className="w-4 h-4 mr-1" />
                Username
              </button>
            </div>
          </div>

          {/* Email/Username Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                {loginType === 'email' ? 'Email Address' : 'Username'}
              </span>
            </label>
            <div className="relative">
              <input
                type={loginType === 'email' ? 'email' : 'text'}
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder={
                  loginType === 'email' 
                    ? 'Enter your email address' 
                    : 'Enter your username'
                }
                className={`input input-bordered w-full ${errors.identifier ? 'input-error' : ''}`}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {loginType === 'email' ? (
                  <Mail className="w-5 h-5 text-base-content/40" />
                ) : (
                  <User className="w-5 h-5 text-base-content/40" />
                )}
              </div>
            </div>
            {errors.identifier && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.identifier}
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="checkbox checkbox-primary checkbox-sm mr-2"
                disabled={isLoading}
              />
              <span className="label-text">Remember me</span>
            </label>
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
              'Sign In'
            )}
          </button>
        </form>

        {/* Sign up link */}
        <div className="divider">OR</div>
        <div className="text-center">
          <span className="text-base-content/60">Don't have an account? </span>
          <Link to="/auth/signup" className="link link-primary font-medium">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;