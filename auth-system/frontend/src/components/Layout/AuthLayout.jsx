import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 flex flex-col">
      {/* Header */}
      <header className="w-full p-6">
        <Link to="/" className="flex items-center text-xl font-bold text-base-content">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
            <Shield className="w-5 h-5 text-primary-content" />
          </div>
          AuthSystem
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full p-6 text-center text-sm text-base-content/60">
        <p>&copy; 2024 AuthSystem. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;