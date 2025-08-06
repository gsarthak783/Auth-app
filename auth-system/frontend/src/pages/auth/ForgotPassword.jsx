import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (error) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-success mb-4" />
          <h2 className="text-2xl font-bold text-base-content mb-2">Check your email</h2>
          <p className="text-base-content/60 mb-6">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p className="text-sm text-base-content/60 mb-6">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setIsSuccess(false);
                setEmail('');
              }}
              className="btn btn-outline"
            >
              Try another email
            </button>
            <Link to="/auth/login" className="btn btn-primary">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-base-content">Reset your password</h2>
          <p className="text-base-content/60 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email address</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Enter your email address"
                className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Mail className="w-5 h-5 text-base-content/40" />
              </div>
            </div>
            {error && (
              <label className="label">
                <span className="label-text-alt text-error">{error}</span>
              </label>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                Sending reset link...
              </>
            ) : (
              'Send reset link'
            )}
          </button>
        </form>

        <div className="divider">OR</div>
        
        <div className="text-center">
          <Link
            to="/auth/login"
            className="btn btn-ghost btn-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;