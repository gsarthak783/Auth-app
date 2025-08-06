import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, FolderOpen, Shield, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'Total Projects',
      value: '3',
      change: '+2 this month',
      changeType: 'increase',
      icon: FolderOpen,
    },
    {
      name: 'Active Users',
      value: '1,234',
      change: '+12% from last month',
      changeType: 'increase',
      icon: Users,
    },
    {
      name: 'Authentication Events',
      value: '45,678',
      change: '+8% from last month',
      changeType: 'increase',
      icon: Shield,
    },
    {
      name: 'Success Rate',
      value: '99.9%',
      change: '+0.1% from last month',
      changeType: 'increase',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-base-content">
          Welcome back, {user?.firstName || user?.username || 'User'}!
        </h1>
        <p className="text-base-content/60 mt-2">
          Here's an overview of your authentication system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-base-content/60">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-base-content">
                      {stat.value}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-success">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="space-y-4 mt-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-base-content/60">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-info rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Password reset requested</p>
                  <p className="text-xs text-base-content/60">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Failed login attempt</p>
                  <p className="text-xs text-base-content/60">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Quick Actions</h3>
            <div className="space-y-3 mt-4">
              <button className="btn btn-outline w-full justify-start">
                <FolderOpen className="w-4 h-4 mr-2" />
                Create New Project
              </button>
              <button className="btn btn-outline w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                View All Users
              </button>
              <button className="btn btn-outline w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Security Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;