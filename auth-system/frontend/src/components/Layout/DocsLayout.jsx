import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Book, 
  Code, 
  Zap, 
  Globe, 
  Settings, 
  Users, 
  FileText, 
  GitBranch, 
  Terminal,
  Smartphone,
  Database,
  Shield,
  ArrowLeft
} from 'lucide-react';

const DocsLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: 'Getting Started',
      items: [
        { name: 'Quick Start', href: '/docs/quickstart', icon: Zap },
        { name: 'Installation', href: '/docs/installation', icon: Terminal },
        { name: 'Authentication', href: '/docs/authentication', icon: Shield },
      ]
    },
    {
      name: 'API Reference',
      items: [
        { name: 'REST API', href: '/docs/api', icon: Globe },
        { name: 'Authentication Endpoints', href: '/docs/api/auth', icon: Shield },
        { name: 'User Management', href: '/docs/api/users', icon: Users },
        { name: 'Project Management', href: '/docs/api/projects', icon: Settings },
      ]
    },
    {
      name: 'SDKs',
      items: [
        { name: 'JavaScript SDK', href: '/docs/sdk', icon: Code },
        { name: 'React SDK', href: '/docs/react', icon: GitBranch },
        { name: 'Node.js Examples', href: '/docs/nodejs', icon: Terminal },
        { name: 'Mobile SDKs', href: '/docs/mobile', icon: Smartphone },
      ]
    },
    {
      name: 'Guides',
      items: [
        { name: 'Integration Examples', href: '/docs/examples', icon: Book },
        { name: 'Best Practices', href: '/docs/best-practices', icon: FileText },
        { name: 'Security Guide', href: '/docs/security', icon: Shield },
        { name: 'Deployment', href: '/docs/deployment', icon: Database },
      ]
    },
    {
      name: 'Features',
      items: [
        { name: 'User Management', href: '/docs/features/users', icon: Users },
        { name: 'Export/Import', href: '/docs/features/export-import', icon: Database },
        { name: 'Custom Fields', href: '/docs/features/custom-fields', icon: Settings },
        { name: 'Webhooks', href: '/docs/features/webhooks', icon: GitBranch },
      ]
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-base-100 flex relative">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, drawer on mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 lg:w-80
        bg-base-200 
        transform transition-transform duration-300 ease-in-out
        lg:transform-none lg:static lg:block
        flex flex-col h-screen
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-base-300 flex-shrink-0">
          <div className="flex items-center">
            <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-primary mr-3" />
            <div>
              <h2 className="text-base lg:text-lg font-bold text-base-content">AccessKit</h2>
              <p className="text-xs text-base-content/60">Documentation</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-base-content/60 hover:text-base-content hover:bg-base-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Back to Dashboard */}
        <div className="p-4 border-b border-base-300 flex-shrink-0">
          <Link 
            to="/dashboard" 
            className="flex items-center text-base-content/70 hover:text-primary transition-colors group"
            onClick={() => setSidebarOpen(false)}
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>

        {/* Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="px-4 lg:px-6 py-6 space-y-8">
            {navigation.map((section) => (
              <div key={section.name}>
                <h3 className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-3">
                  {section.name}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isActive(item.href)
                              ? 'bg-primary text-primary-content'
                              : 'text-base-content/70 hover:text-base-content hover:bg-base-300'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer - Optional */}
        <div className="p-4 border-t border-base-300 flex-shrink-0">
          <div className="text-xs text-base-content/60 text-center">
            Version 1.0.0
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top navigation */}
        <header className="navbar bg-base-100 shadow-sm border-b border-base-300 lg:hidden sticky top-0 z-30">
          <div className="flex-none">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-square btn-ghost"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-primary mr-2" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Documentation
              </span>
            </div>
          </div>
          <div className="flex-none">
            <Link to="/dashboard" className="btn btn-sm btn-ghost">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-base-100">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsLayout; 