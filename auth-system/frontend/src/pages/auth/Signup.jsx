import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, AlertCircle, Building2, Globe } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const Signup = () => {
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    website: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must be a valid URL (e.g., https://example.com)';
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
      const userData = {
        email: formData.email.trim(),
        username: formData.username.trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        company: formData.company.trim(),
        website: formData.website.trim(),
      };

      await signup(userData);
      
      // Redirect to dashboard on successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
      // Error handling is done in the auth context
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-base-content">Create Your Account</h2>
          <p className="text-base-content/60 mt-2">
            Join AuthSystem to manage authentication for your projects
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name *</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                disabled={isLoading}
              />
              {errors.firstName && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.firstName}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="input input-bordered w-full"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email Address *</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.email && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </span>
              </label>
            )}
          </div>

          {/* Username Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username *</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="johndoe"
              className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
              disabled={isLoading}
            />
            {errors.username && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.username}
                </span>
              </label>
            )}
          </div>

          {/* Company and Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  Company
                </span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Corp"
                className="input input-bordered w-full"
                disabled={isLoading}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center">
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </span>
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className={`input input-bordered w-full ${errors.website ? 'input-error' : ''}`}
                disabled={isLoading}
              />
              {errors.website && (
                <label className="label">
                  <span className="label-text-alt text-error flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.website}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password *</span>
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

          {/* Confirm Password Input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password *</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`input input-bordered w-full pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-base-content/40" />
                ) : (
                  <Eye className="w-5 h-5 text-base-content/40" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirmPassword}
                </span>
              </label>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start">
              <input type="checkbox" className="checkbox checkbox-primary mr-3" required />
              <span className="label-text">
                I agree to the{' '}
                <Link to="/terms" className="link link-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="link link-primary">
                  Privacy Policy
                </Link>
              </span>
            </label>
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
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Sign in link */}
        <div className="divider">OR</div>
        <div className="text-center">
          <span className="text-base-content/60">Already have an account? </span>
          <Link to="/auth/login" className="link link-primary font-medium">
            Sign in
          </Link>
        </div>

        {/* Features Preview */}
        <div className="mt-6 p-4 bg-base-200 rounded-lg">
          <h3 className="font-semibold text-base-content mb-2">
            What you'll get with your account:
          </h3>
          <ul className="text-sm text-base-content/80 space-y-1">
            <li>• Create up to 3 authentication projects</li>
            <li>• Manage up to 1,000 users per project</li>
            <li>• 10,000 API calls per month</li>
            <li>• Complete authentication system</li>
            <li>• Project analytics and insights</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Signup;