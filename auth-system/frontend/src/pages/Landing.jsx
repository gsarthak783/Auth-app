import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Lock, Zap } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <header className="navbar bg-base-100 border-b border-base-300">
        <div className="navbar-start">
          <Link to="/" className="flex items-center text-xl font-bold">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-primary-content" />
            </div>
            AuthSystem
          </Link>
        </div>
        <div className="navbar-end gap-2">
          <Link to="/auth/login" className="btn btn-ghost">
            Sign In
          </Link>
          <Link to="/auth/signup" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero min-h-[80vh] bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold gradient-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Firebase-like Authentication System
            </h1>
            <p className="py-6 text-xl text-base-content/80 max-w-2xl mx-auto">
              Build secure, scalable authentication for your applications with our comprehensive 
              user management system. Easy to integrate, powerful to use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/signup" className="btn btn-primary btn-lg">
                Start Building
              </Link>
              <Link to="/dashboard" className="btn btn-outline btn-lg">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              Everything you need for authentication
            </h2>
            <p className="text-base-content/70 max-w-2xl mx-auto">
              Complete authentication solution with user management, project organization, 
              and enterprise-grade security features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="card-title text-lg">User Management</h3>
                <p className="text-base-content/70">
                  Complete user lifecycle management with profiles, roles, and permissions.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="card-title text-lg">Multi-Project Auth</h3>
                <p className="text-base-content/70">
                  Organize users across multiple projects with isolated authentication.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="card-title text-lg">Enterprise Security</h3>
                <p className="text-base-content/70">
                  Advanced security features including 2FA, session management, and audit logs.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body items-center text-center">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <h3 className="card-title text-lg">Easy Integration</h3>
                <p className="text-base-content/70">
                  RESTful API with comprehensive documentation and SDKs for popular frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-base-content mb-4">
            Ready to get started?
          </h2>
          <p className="text-base-content/70 mb-8 max-w-xl mx-auto">
            Create your account and start building secure authentication for your applications today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup" className="btn btn-primary btn-lg">
              Create Account
            </Link>
            <a href="#docs" className="btn btn-outline btn-lg">
              Read Documentation
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Shield className="w-5 h-5 text-primary-content" />
            </div>
            <span className="text-xl font-bold">AuthSystem</span>
          </div>
          <p className="text-base-content/70">
            Secure authentication for modern applications
          </p>
          <p>&copy; 2024 AuthSystem. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;