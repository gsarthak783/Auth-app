import React from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-base-content">Set New Password</h2>
          <p className="text-base-content/60 mt-2">Enter your new password</p>
        </div>
        <p className="text-center">Reset password page coming soon!</p>
        <div className="text-center mt-4">
          <Link to="/auth/login" className="link link-primary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;