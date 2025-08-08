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
    <div className="min-h-screen bg-base-100 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-base-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:h-screen ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-base-300">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <div>
              <h2 className="text-lg font-bold text-base-content">AuthSystem</h2>
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
        <div className="p-4 border-b border-base-300">
          <Link 
            to="/dashboard" 
            className="flex items-center text-base-content/70 hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <nav className="space-y-8">
            {navigation.map((section, sectionIdx) => (
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
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <div className="navbar bg-gradient-to-r from-base-100 to-base-200 shadow-lg border-b border-base-300/50 lg:hidden sticky top-0 z-30 backdrop-blur-md">
          <div className="flex-none">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-square btn-ghost hover:bg-primary/10"
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
        </div>

        {/* Page content */}
        <main className="flex-1 bg-base-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DocsLayout; 