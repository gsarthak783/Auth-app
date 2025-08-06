import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Settings, 
  Users, 
  Key, 
  BarChart3, 
  Calendar,
  Search,
  Filter,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { projectsAPI } from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectsContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const Projects = () => {
  const { user } = useAuth();
  const { projects, isLoading, loadProjects } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showApiKeys, setShowApiKeys] = useState({});

  const toggleApiKeyVisibility = (projectId) => {
    setShowApiKeys(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && project.isActive) ||
                         (filterStatus === 'inactive' && !project.isActive);
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const maskApiKey = (apiKey) => {
    if (!apiKey) return '';
    return apiKey.substring(0, 8) + '••••••••' + apiKey.substring(apiKey.length - 4);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-base-content/60">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Projects</h1>
          <p className="text-base-content/60 mt-1">
            Manage your authentication projects and their users
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadProjects}
            className="btn btn-ghost gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <Link
            to="/projects/create"
            className="btn btn-primary gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-bordered"
          >
            <option value="all">All Projects</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-xl font-semibold text-base-content mb-2">
            {projects.length === 0 ? 'No projects yet' : 'No projects found'}
          </h3>
          <p className="text-base-content/60 mb-6">
            {projects.length === 0 
              ? 'Create your first authentication project to get started'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {projects.length === 0 && (
            <Link to="/projects/create" className="btn btn-primary">
              Create Your First Project
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link to={`/project/${project.id}`} className="hover:text-primary transition-colors">
                      <h3 className="card-title text-lg">{project.name}</h3>
                    </Link>
                    <p className="text-base-content/60 text-sm mt-1 line-clamp-2">
                      {project.description || 'No description provided'}
                    </p>
                  </div>
                  <div className={`badge ${project.isActive ? 'badge-success' : 'badge-error'}`}>
                    {project.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                {/* API Key */}
                <div className="mt-4 p-3 bg-base-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">API Key</span>
                    <button
                      onClick={() => toggleApiKeyVisibility(project.id)}
                      className="btn btn-ghost btn-xs"
                    >
                      {showApiKeys[project.id] ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <code className="text-xs font-mono break-all">
                                          {showApiKeys[project.id] ? project.apiKey : maskApiKey(project.apiKey)}
                  </code>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {project.statistics?.totalUsers || 0}
                    </div>
                    <div className="text-xs text-base-content/60">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">
                      {project.statistics?.totalLogins || 0}
                    </div>
                    <div className="text-xs text-base-content/60">Logins</div>
                  </div>
                </div>

                {/* Creation Date */}
                <div className="flex items-center gap-2 text-xs text-base-content/60 mt-4">
                  <Calendar className="w-3 h-3" />
                  Created {formatDate(project.createdAt)}
                </div>

                {/* Actions */}
                <div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
                  <Link
                    to={`/project/${project.id}/users`}
                    className="btn btn-sm btn-outline gap-1"
                  >
                    <Users className="w-4 h-4" />
                    Users
                  </Link>
                  <Link
                    to={`/project/${project.id}/analytics`}
                    className="btn btn-sm btn-outline gap-1"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </Link>
                  <Link
                    to={`/project/${project.id}/settings`}
                    className="btn btn-sm btn-primary gap-1"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Total Projects</div>
            <div className="stat-value text-primary">{projects.length}</div>
          </div>
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Active Projects</div>
            <div className="stat-value text-success">
              {projects.filter(p => p.isActive).length}
            </div>
          </div>
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-secondary">
              {projects.reduce((sum, p) => sum + (p.statistics?.totalUsers || 0), 0)}
            </div>
          </div>
          <div className="stat bg-base-100 shadow rounded-lg">
            <div className="stat-title">Total Logins</div>
            <div className="stat-value text-accent">
              {projects.reduce((sum, p) => sum + (p.statistics?.totalLogins || 0), 0)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;