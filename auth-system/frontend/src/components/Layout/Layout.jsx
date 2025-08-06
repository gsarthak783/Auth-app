import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LogOut, 
  User, 
  Settings, 
  FolderOpen, 
  Home,
  Menu,
  X,
  Shield
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Documentation', href: '/docs', icon: Shield },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-base-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-screen ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-base-300">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-content" />
            </div>
            <span className="ml-2 text-xl font-bold text-base-content">AuthSystem</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-base-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-content'
                        : 'text-base-content hover:bg-base-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300">
          <div className="flex items-center mb-4">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                <span className="text-sm">
                  {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-base-content truncate">
                {user?.displayName || user?.firstName || user?.username}
              </p>
              <p className="text-xs text-base-content/60 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-error hover:bg-error/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col min-h-screen flex-1">
        {/* Top navigation */}
        <div className="navbar bg-base-100 border-b border-base-300 lg:hidden sticky top-0 z-30">
          <div className="flex-none">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-square btn-ghost"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">AuthSystem</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-base-100">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-base-200 border-t border-base-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Product */}
                <div>
                  <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-4">
                    Product
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link to="/dashboard" className="text-base-content/70 hover:text-base-content transition-colors">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/projects" className="text-base-content/70 hover:text-base-content transition-colors">
                        Projects
                      </Link>
                    </li>
                    <li>
                      <Link to="/docs/features" className="text-base-content/70 hover:text-base-content transition-colors">
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link to="/docs/pricing" className="text-base-content/70 hover:text-base-content transition-colors">
                        Pricing
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Documentation */}
                <div>
                  <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-4">
                    Documentation
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link to="/docs/quickstart" className="text-base-content/70 hover:text-base-content transition-colors">
                        Quick Start
                      </Link>
                    </li>
                    <li>
                      <Link to="/docs/api" className="text-base-content/70 hover:text-base-content transition-colors">
                        API Reference
                      </Link>
                    </li>
                    <li>
                      <Link to="/docs/sdk" className="text-base-content/70 hover:text-base-content transition-colors">
                        JavaScript SDK
                      </Link>
                    </li>
                    <li>
                      <Link to="/docs/react" className="text-base-content/70 hover:text-base-content transition-colors">
                        React SDK
                      </Link>
                    </li>
                    <li>
                      <Link to="/docs/examples" className="text-base-content/70 hover:text-base-content transition-colors">
                        Examples
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-4">
                    Support
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="mailto:support@yourauth.com" className="text-base-content/70 hover:text-base-content transition-colors">
                        Contact Support
                      </a>
                    </li>
                    <li>
                      <Link to="/docs/guides" className="text-base-content/70 hover:text-base-content transition-colors">
                        Guides
                      </Link>
                    </li>
                    <li>
                      <Link to="/docs/troubleshooting" className="text-base-content/70 hover:text-base-content transition-colors">
                        Troubleshooting
                      </Link>
                    </li>
                    <li>
                      <a href="https://status.yourauth.com" target="_blank" rel="noopener noreferrer" className="text-base-content/70 hover:text-base-content transition-colors">
                        Status Page
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h3 className="text-sm font-semibold text-base-content uppercase tracking-wider mb-4">
                    Company
                  </h3>
                  <ul className="space-y-3">
                    <li>
                      <Link to="/about" className="text-base-content/70 hover:text-base-content transition-colors">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link to="/privacy" className="text-base-content/70 hover:text-base-content transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/terms" className="text-base-content/70 hover:text-base-content transition-colors">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <a href="https://github.com/yourusername/auth-system" target="_blank" rel="noopener noreferrer" className="text-base-content/70 hover:text-base-content transition-colors">
                        GitHub
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom section */}
              <div className="mt-8 pt-8 border-t border-base-300">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Shield className="w-6 h-6 text-primary mr-2" />
                      <span className="text-lg font-bold text-base-content">AuthSystem</span>
                    </div>
                    <span className="text-base-content/60">
                      © 2024 AuthSystem. All rights reserved.
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-6 mt-4 md:mt-0">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm text-base-content/60">All systems operational</span>
                    </div>
                    <div className="text-sm text-base-content/60">
                      API Status: <span className="text-success">Healthy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;