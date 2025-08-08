import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../contexts/ProjectsContext';
import {
  Plus,
  Settings,
  Users,
  BarChart3,
  Key,
  Globe,
  Calendar,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, canCreateProject, getRemainingProjects } = useAuth();
  const { projects: userProjects, isLoading: projectsLoading } = useProjects();
  const navigate = useNavigate();

  const handleCreateProject = () => {
    if (canCreateProject()) {
      navigate('/projects/create');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProjectStatusColor = (isActive) => {
    return isActive ? 'badge-success' : 'badge-error';
  };

  const getSubscriptionBadge = (plan) => {
    const badges = {
      free: 'badge-ghost',
      pro: 'badge-primary',
      enterprise: 'badge-secondary'
    };
    return badges[plan] || badges.free;
  };

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-base-content/60 mt-1">
              Manage your authentication projects and monitor your users
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`badge ${getSubscriptionBadge(user?.subscription?.plan)} badge-lg`}>
              {user?.subscription?.plan?.toUpperCase() || 'FREE'}
            </div>
            <button
              onClick={handleCreateProject}
              disabled={!canCreateProject()}
              className="btn btn-primary gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-primary">
              <Globe className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Projects</div>
            <div className="stat-value text-primary">{user?.stats?.totalProjects || 0}</div>
            <div className="stat-desc">
              {getRemainingProjects()} remaining
            </div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-secondary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-secondary">
              {userProjects?.reduce((total, project) => total + (project.statistics?.totalUsers || 0), 0) || 0}
            </div>
            <div className="stat-desc">Across all projects</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-accent">
              <Zap className="w-8 h-8" />
            </div>
            <div className="stat-title">API Calls</div>
            <div className="stat-value text-accent">
              {user?.stats?.totalAPICallsThisMonth?.toLocaleString() || 0}
            </div>
            <div className="stat-desc">This month</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow">
            <div className="stat-figure text-info">
              <Shield className="w-8 h-8" />
            </div>
            <div className="stat-title">Security Score</div>
            <div className="stat-value text-info">98%</div>
            <div className="stat-desc">All systems secure</div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-base-content">Your Projects</h2>
          <Link to="/projects" className="link link-primary">
            View all projects
          </Link>
        </div>

        {userProjects?.length === 0 ? (
          /* Empty State */
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center py-16">
              <Globe className="w-16 h-16 mx-auto text-base-content/40 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-base-content/60 mb-6 max-w-md mx-auto">
                Create your first authentication project to start managing users and securing your applications.
              </p>
              <button
                onClick={handleCreateProject}
                disabled={!canCreateProject()}
                className="btn btn-primary gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Project
              </button>
              {!canCreateProject() && (
                <p className="text-sm text-warning mt-2">
                  You've reached your project limit. Upgrade your plan to create more projects.
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects?.slice(0, 6).map((project) => (
              <div key={project.id || project._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="card-title text-lg">{project.name}</h3>
                      <p className="text-sm text-base-content/60 line-clamp-2">
                        {project.description || 'No description provided'}
                      </p>
                    </div>
                    <div className={`badge ${getProjectStatusColor(project.isActive)} badge-sm`}>
                      {project.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {(project.stats?.totalUsers ?? project.statistics?.totalUsers) || 0}
                      </div>
                      <div className="text-xs text-base-content/60">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-secondary">
                        {(project.stats?.totalLogins ?? project.statistics?.totalLogins) || 0}
                      </div>
                      <div className="text-xs text-base-content/60">Logins</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-base-content/60 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(project.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Key className="w-3 h-3" />
                      {project.apiKey?.slice(0, 8)}...
                    </div>
                  </div>

                  <div className="card-actions justify-between">
                    <div className="btn-group btn-group-horizontal">
                      <Link
                        to={`/project/${project.id || project._id}`}
                        className="btn btn-sm btn-outline"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/project/${project.id || project._id}/users`}
                        className="btn btn-sm btn-outline"
                      >
                        <Users className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/project/${project.id || project._id}/settings`}
                        className="btn btn-sm btn-outline"
                      >
                        <Settings className="w-4 h-4" />
                      </Link>
                    </div>
                    <Link
                      to={`/project/${project.id || project._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Create New Project Card */}
            {canCreateProject() && (
              <div className="card bg-base-100 shadow-lg border-2 border-dashed border-base-300 hover:border-primary transition-colors">
                <div className="card-body items-center text-center justify-center min-h-[300px] cursor-pointer" onClick={handleCreateProject}>
                  <Plus className="w-12 h-12 text-base-content/40 mb-4" />
                  <h3 className="text-lg font-semibold text-base-content/80">Create New Project</h3>
                  <p className="text-sm text-base-content/60">
                    Set up authentication for a new application
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link to="/projects/create" className="btn btn-ghost btn-sm justify-start w-full">
                <Plus className="w-4 h-4 mr-2" />
                Create new project
              </Link>
              <Link to="/profile" className="btn btn-ghost btn-sm justify-start w-full">
                <Settings className="w-4 h-4 mr-2" />
                Account settings
              </Link>
              <Link to="/projects" className="btn btn-ghost btn-sm justify-start w-full">
                <Globe className="w-4 h-4 mr-2" />
                View all projects
              </Link>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Demo Project</span> created
                  <div className="text-xs text-base-content/60">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-info rounded-full"></div>
                <div className="text-sm">
                  Account settings updated
                  <div className="text-xs text-base-content/60">1 day ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="text-sm">
                  API key regenerated
                  <div className="text-xs text-base-content/60">3 days ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;