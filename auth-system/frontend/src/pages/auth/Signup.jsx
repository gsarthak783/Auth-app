import React from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-base-content">Create Account</h2>
          <p className="text-base-content/60 mt-2">Sign up for a new account</p>
        </div>
        <p className="text-center">Signup page coming soon!</p>
        <div className="text-center mt-4">
          <Link to="/auth/login" className="link link-primary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;