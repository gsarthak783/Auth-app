import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col">
      {/* Navigation - Same as Landing page */}
      <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-300/50">
        <div className="navbar-start">
          <Link to="/" className="flex items-center">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-primary mr-2 sm:mr-3" />
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AccessKit
            </span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/" className="font-medium">Home</Link></li>
            <li><Link to="/docs" className="font-medium">Documentation</Link></li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link to="/auth/login" className="btn btn-ghost btn-sm mr-1 sm:mr-2">Sign In</Link>
          <Link to="/auth/signup" className="btn btn-primary btn-sm">
            <span className="hidden sm:inline">Get Started</span>
            <span className="sm:hidden">Start</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Footer - Responsive */}
      <footer className="w-full p-4 sm:p-6 text-center text-sm text-base-content/60 border-t border-base-300/50">
        <p>&copy; 2025 AccessKit. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;