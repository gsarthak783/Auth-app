import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectsContext';
import { projectUsersAPI } from '../../utils/api';
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  User,
  Eye,
  Ban,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProjectUsers = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentProject, getProject } = useProjects();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const loadProjectData = async () => {
    try {
      await getProject(projectId);
      await loadStats();
    } catch (error) {
      console.error('Failed to load project:', error);
      navigate('/projects');
    }
  };

  const loadUsers = async () => {
    if (!currentProject?.apiKey) return;

    try {
      setIsLoading(true);
      const params = {
        page: currentPage,
        limit: 20,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };

      const response = await projectUsersAPI.getProjectUsers(currentProject.apiKey, params);
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    if (!currentProject?.apiKey) return;

    try {
      const response = await projectUsersAPI.getProjectUserStats(currentProject.apiKey);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleUserSelection = (userId, isSelected) => {
    if (isSelected) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUpdateUserStatus = async (userId, statusData) => {
    try {
      await projectUsersAPI.updateProjectUserStatus(currentProject.apiKey, userId, statusData);
      toast.success('User status updated successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await projectUsersAPI.deleteProjectUser(currentProject.apiKey, userId);
        toast.success('User deleted successfully');
        loadUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;

    const confirmation = window.confirm(
      `Are you sure you want to ${action} ${selectedUsers.length} selected users?`
    );

    if (!confirmation) return;

    try {
      const promises = selectedUsers.map(userId => {
        switch (action) {
          case 'activate':
            return projectUsersAPI.updateProjectUserStatus(currentProject.apiKey, userId, { isActive: true });
          case 'deactivate':
            return projectUsersAPI.updateProjectUserStatus(currentProject.apiKey, userId, { isActive: false });
          case 'verify':
            return projectUsersAPI.updateProjectUserStatus(currentProject.apiKey, userId, { isVerified: true });
          case 'suspend':
            return projectUsersAPI.updateProjectUserStatus(currentProject.apiKey, userId, { isSuspended: true });
          case 'delete':
            return projectUsersAPI.deleteProjectUser(currentProject.apiKey, userId);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      toast.success(`Successfully ${action}d ${selectedUsers.length} users`);
      setSelectedUsers([]);
      loadUsers();
    } catch (error) {
      toast.error(`Failed to ${action} users`);
    }
  };

  const exportUsers = () => {
    const csvData = users.map(user => ({
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      isVerified: user.isVerified,
      isSuspended: user.isSuspended,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject?.name || 'project'}-users.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (user) => {
    if (user.isSuspended) {
      return <span className="badge badge-error badge-sm">Suspended</span>;
    }
    if (!user.isActive) {
      return <span className="badge badge-warning badge-sm">Inactive</span>;
    }
    if (!user.isVerified) {
      return <span className="badge badge-info badge-sm">Unverified</span>;
    }
    return <span className="badge badge-success badge-sm">Active</span>;
  };

  if (!currentProject) {
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
          <h1 className="text-3xl font-bold text-base-content">User Management</h1>
          <p className="text-base-content/60 mt-1">
            Manage users for {currentProject.name}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => loadUsers()}
            className="btn btn-outline btn-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportUsers}
            className="btn btn-outline btn-sm"
            disabled={users.length === 0}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-primary">
            <User className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{stats?.totalUsers || 0}</div>
          <div className="stat-desc">{stats?.usersToday || 0} today</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-success">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="stat-title">Active Users</div>
          <div className="stat-value text-success">{stats?.activeUsers || 0}</div>
          <div className="stat-desc">{stats?.usersThisWeek || 0} this week</div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-info">
            <Mail className="w-8 h-8" />
          </div>
          <div className="stat-title">Verified</div>
          <div className="stat-value text-info">{stats?.verifiedUsers || 0}</div>
          <div className="stat-desc">
            {Math.round(((stats?.verifiedUsers || 0) / (stats?.totalUsers || 1)) * 100)}% verified
          </div>
        </div>

        <div className="stat bg-base-100 rounded-lg shadow">
          <div className="stat-figure text-warning">
            <Ban className="w-8 h-8" />
          </div>
          <div className="stat-title">Suspended</div>
          <div className="stat-value text-warning">{stats?.suspendedUsers || 0}</div>
          <div className="stat-desc">Suspended accounts</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card bg-base-100 shadow-lg mb-6">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="form-control">
                <div className="input-group">
                  <span>
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search users by email, name, or username..."
                    className="input input-bordered flex-1"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-outline btn-sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter: {statusFilter}
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                  <li><a onClick={() => handleStatusFilter('all')}>All Users</a></li>
                  <li><a onClick={() => handleStatusFilter('active')}>Active</a></li>
                  <li><a onClick={() => handleStatusFilter('inactive')}>Inactive</a></li>
                  <li><a onClick={() => handleStatusFilter('verified')}>Verified</a></li>
                  <li><a onClick={() => handleStatusFilter('unverified')}>Unverified</a></li>
                  <li><a onClick={() => handleStatusFilter('suspended')}>Suspended</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-base-200 rounded-lg">
              <span className="text-sm font-medium">
                {selectedUsers.length} users selected
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="btn btn-success btn-xs"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="btn btn-warning btn-xs"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('verify')}
                  className="btn btn-info btn-xs"
                >
                  Verify
                </button>
                <button
                  onClick={() => handleBulkAction('suspend')}
                  className="btn btn-error btn-xs"
                >
                  Suspend
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  className="btn btn-error btn-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto text-base-content/40 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No users found</h3>
              <p className="text-base-content/60">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'No users have registered for this project yet.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={selectedUsers.length === users.length && users.length > 0}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th>User</th>
                      <th>Status</th>
                      <th>Registration</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="hover">
                        <td>
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={selectedUsers.includes(user._id)}
                            onChange={(e) => handleUserSelection(user._id, e.target.checked)}
                          />
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                              <div className="bg-neutral-focus text-neutral-content rounded-full w-8 h-8">
                                <span className="text-xs">
                                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.username || 'No name'}
                              </div>
                              <div className="text-sm text-base-content/60">{user.email}</div>
                              {user.username && (
                                <div className="text-xs text-base-content/40">@{user.username}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1">
                            {getStatusBadge(user)}
                            <div className="flex gap-1">
                              {user.isVerified && (
                                <CheckCircle className="w-3 h-3 text-success" title="Verified" />
                              )}
                              {user.isActive && (
                                <Shield className="w-3 h-3 text-info" title="Active" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="text-sm">
                            {formatDate(user.createdAt)}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm">
                            {formatDate(user.lastLogin)}
                          </div>
                        </td>
                        <td>
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-sm">
                              <MoreVertical className="w-4 h-4" />
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 z-10">
                              <li>
                                <a onClick={() => handleUpdateUserStatus(user._id, { 
                                  isActive: !user.isActive 
                                })}>
                                  {user.isActive ? (
                                    <>
                                      <ShieldOff className="w-4 h-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="w-4 h-4" />
                                      Activate
                                    </>
                                  )}
                                </a>
                              </li>
                              <li>
                                <a onClick={() => handleUpdateUserStatus(user._id, { 
                                  isVerified: !user.isVerified 
                                })}>
                                  {user.isVerified ? (
                                    <>
                                      <XCircle className="w-4 h-4" />
                                      Unverify
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4" />
                                      Verify
                                    </>
                                  )}
                                </a>
                              </li>
                              <li>
                                <a onClick={() => handleUpdateUserStatus(user._id, { 
                                  isSuspended: !user.isSuspended 
                                })}>
                                  {user.isSuspended ? (
                                    <>
                                      <CheckCircle className="w-4 h-4" />
                                      Unsuspend
                                    </>
                                  ) : (
                                    <>
                                      <Ban className="w-4 h-4" />
                                      Suspend
                                    </>
                                  )}
                                </a>
                              </li>
                              <li className="divider"></li>
                              <li>
                                <a 
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-error"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete User
                                </a>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="btn-group">
                    <button
                      className="btn btn-sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      «
                    </button>
                    {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                      const pageNum = Math.max(1, Math.min(currentPage - 2 + i, totalPages - 4 + i));
                      return (
                        <button
                          key={pageNum}
                          className={`btn btn-sm ${currentPage === pageNum ? 'btn-active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      className="btn btn-sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      »
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectUsers;