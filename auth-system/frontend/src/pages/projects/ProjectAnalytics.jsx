import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectsContext';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  UserPlus,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProjectAnalytics = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, getProject, getProjectStats } = useProjects();

  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId, timeRange]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);
      await getProject(projectId);
      const projectStats = await getProjectStats(projectId);
      setStats(projectStats);
    } catch (error) {
      console.error('Failed to load project data:', error);
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  const getGrowthPercent = (current, previous) => {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const mockChartData = {
    userRegistrations: [
      { date: '2024-01-01', count: 12 },
      { date: '2024-01-02', count: 15 },
      { date: '2024-01-03', count: 8 },
      { date: '2024-01-04', count: 22 },
      { date: '2024-01-05', count: 18 },
      { date: '2024-01-06', count: 25 },
      { date: '2024-01-07', count: 30 }
    ],
    logins: [
      { date: '2024-01-01', count: 45 },
      { date: '2024-01-02', count: 52 },
      { date: '2024-01-03', count: 38 },
      { date: '2024-01-04', count: 67 },
      { date: '2024-01-05', count: 55 },
      { date: '2024-01-06', count: 73 },
      { date: '2024-01-07', count: 82 }
    ]
  };

  if (!currentProject && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-base-content">Analytics</h1>
          <p className="text-base-content/60 mt-1">
            Insights and metrics for {currentProject?.name}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-outline btn-sm">
              <Filter className="w-4 h-4 mr-1" />
              {timeRange === '7d' ? 'Last 7 days' : 
               timeRange === '30d' ? 'Last 30 days' : 
               timeRange === '90d' ? 'Last 90 days' : 'Last year'}
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-10">
              <li><a onClick={() => setTimeRange('7d')}>Last 7 days</a></li>
              <li><a onClick={() => setTimeRange('30d')}>Last 30 days</a></li>
              <li><a onClick={() => setTimeRange('90d')}>Last 90 days</a></li>
              <li><a onClick={() => setTimeRange('1y')}>Last year</a></li>
            </ul>
          </div>
          <button
            onClick={() => loadProjectData()}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="btn btn-outline btn-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value text-primary">{formatNumber(stats?.totalUsers || 0)}</div>
              <div className="stat-desc">
                <span className="text-success">+{getGrowthPercent(stats?.totalUsers, stats?.previousTotalUsers)}%</span> from last period
              </div>
            </div>

            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-figure text-secondary">
                <UserPlus className="w-8 h-8" />
              </div>
              <div className="stat-title">New Registrations</div>
              <div className="stat-value text-secondary">{formatNumber(stats?.newRegistrations || 0)}</div>
              <div className="stat-desc">
                <span className="text-success">+{getGrowthPercent(stats?.newRegistrations, stats?.previousNewRegistrations)}%</span> from last period
              </div>
            </div>

            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-figure text-accent">
                <Activity className="w-8 h-8" />
              </div>
              <div className="stat-title">Active Users</div>
              <div className="stat-value text-accent">{formatNumber(stats?.activeUsers || 0)}</div>
              <div className="stat-desc">
                <span className="text-success">+{getGrowthPercent(stats?.activeUsers, stats?.previousActiveUsers)}%</span> from last period
              </div>
            </div>

            <div className="stat bg-base-100 rounded-lg shadow">
              <div className="stat-figure text-warning">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Logins</div>
              <div className="stat-value text-warning">{formatNumber(stats?.totalLogins || 0)}</div>
              <div className="stat-desc">
                <span className="text-success">+{getGrowthPercent(stats?.totalLogins, stats?.previousTotalLogins)}%</span> from last period
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Registrations Chart */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">User Registrations</h2>
                <div className="h-64 flex items-center justify-center bg-base-200 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto text-primary mb-2" />
                    <p className="text-base-content/60">Chart visualization would go here</p>
                    <p className="text-xs text-base-content/40 mt-1">
                      Integration with Chart.js or similar library
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-2xl font-bold text-primary">{formatNumber(stats?.newRegistrations || 0)}</p>
                    <p className="text-sm text-base-content/60">New users this period</p>
                  </div>
                  <div className="text-right">
                    <p className="text-success text-sm">
                      +{getGrowthPercent(stats?.newRegistrations, stats?.previousNewRegistrations)}%
                    </p>
                    <p className="text-xs text-base-content/60">vs last period</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Login Activity Chart */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">Login Activity</h2>
                <div className="h-64 flex items-center justify-center bg-base-200 rounded-lg">
                  <div className="text-center">
                    <Activity className="w-12 h-12 mx-auto text-secondary mb-2" />
                    <p className="text-base-content/60">Chart visualization would go here</p>
                    <p className="text-xs text-base-content/40 mt-1">
                      Daily login trends and patterns
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-2xl font-bold text-secondary">{formatNumber(stats?.totalLogins || 0)}</p>
                    <p className="text-sm text-base-content/60">Total logins this period</p>
                  </div>
                  <div className="text-right">
                    <p className="text-success text-sm">
                      +{getGrowthPercent(stats?.totalLogins, stats?.previousTotalLogins)}%
                    </p>
                    <p className="text-xs text-base-content/60">vs last period</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Status Breakdown */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg">User Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Users</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm font-medium">{formatNumber(stats?.activeUsers || 0)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Verified Users</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-info rounded-full"></div>
                      <span className="text-sm font-medium">{formatNumber(stats?.verifiedUsers || 0)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Suspended Users</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-warning rounded-full"></div>
                      <span className="text-sm font-medium">{formatNumber(stats?.suspendedUsers || 0)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Inactive Users</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-error rounded-full"></div>
                      <span className="text-sm font-medium">{formatNumber(stats?.inactiveUsers || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Days */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg">Top Performing Days</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monday</span>
                    <span className="text-sm font-medium">24 logins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Wednesday</span>
                    <span className="text-sm font-medium">22 logins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Friday</span>
                    <span className="text-sm font-medium">19 logins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tuesday</span>
                    <span className="text-sm font-medium">17 logins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Metrics */}
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg">Security Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Failed Logins</span>
                    <span className="text-sm font-medium text-error">{formatNumber(stats?.failedLogins || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Password Resets</span>
                    <span className="text-sm font-medium text-warning">{formatNumber(stats?.passwordResets || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Locked Accounts</span>
                    <span className="text-sm font-medium text-error">{formatNumber(stats?.lockedAccounts || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">2FA Enabled</span>
                    <span className="text-sm font-medium text-success">{formatNumber(stats?.twoFactorEnabled || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registration</p>
                    <p className="text-xs text-base-content/60">user@example.com registered 2 minutes ago</p>
                  </div>
                  <span className="text-xs text-base-content/60">2m ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <div className="w-2 h-2 bg-info rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">User login</p>
                    <p className="text-xs text-base-content/60">admin@demo.com logged in successfully</p>
                  </div>
                  <span className="text-xs text-base-content/60">5m ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Password reset</p>
                    <p className="text-xs text-base-content/60">Password reset requested for test@example.com</p>
                  </div>
                  <span className="text-xs text-base-content/60">15m ago</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email verification</p>
                    <p className="text-xs text-base-content/60">newuser@example.com verified their email</p>
                  </div>
                  <span className="text-xs text-base-content/60">1h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAnalytics;