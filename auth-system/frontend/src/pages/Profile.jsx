import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Globe,
  Shield,
  Key,
  Trash2,
  Save,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, changePassword, deleteAccount, isLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    company: user?.company || '',
    website: user?.website || '',
    bio: user?.bio || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (profileData.website && !profileData.website.startsWith('http')) {
      newErrors.website = 'Website must be a valid URL (e.g., https://example.com)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      return;
    }

    try {
      setIsUpdating(true);
      await updateProfile(profileData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    try {
      setIsUpdating(true);
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Clear password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password changed successfully! Please login again.');
    } catch (error) {
      console.error('Failed to change password:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    const password = window.prompt(
      'This action cannot be undone. Please enter your password to confirm account deletion:'
    );
    
    if (!password) return;
    
    const confirmDelete = window.confirm(
      'Are you absolutely sure you want to delete your account? This will also delete all your projects and their users.'
    );
    
    if (!confirmDelete) return;

    try {
      await deleteAccount(password);
      toast.success('Account deleted successfully');
    } catch (error) {
      toast.error('Failed to delete account. Please check your password.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSubscriptionBadge = (plan) => {
    const badges = {
      free: 'badge-ghost',
      pro: 'badge-primary',
      enterprise: 'badge-secondary'
    };
    return badges[plan] || badges.free;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-base-content">Account Settings</h1>
        <p className="text-base-content/60 mt-1">
          Manage your profile, security, and account preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed mb-6">
        <a
          className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User className="w-4 h-4 mr-2" />
          Profile
        </a>
        <a
          className={`tab ${activeTab === 'security' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <Shield className="w-4 h-4 mr-2" />
          Security
        </a>
        <a
          className={`tab ${activeTab === 'subscription' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('subscription')}
        >
          <Key className="w-4 h-4 mr-2" />
          Subscription
        </a>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Profile Information</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">First Name *</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      className={`input input-bordered ${errors.firstName ? 'input-error' : ''}`}
                      disabled={isUpdating}
                    />
                    {errors.firstName && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.firstName}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Last Name</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      className="input input-bordered"
                      disabled={isUpdating}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address *</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                      disabled={isUpdating}
                    />
                    <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  </div>
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      className="input input-bordered w-full"
                      disabled={isUpdating}
                    />
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Company</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="company"
                        value={profileData.company}
                        onChange={handleProfileChange}
                        className="input input-bordered w-full"
                        disabled={isUpdating}
                      />
                      <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Website</span>
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        name="website"
                        value={profileData.website}
                        onChange={handleProfileChange}
                        placeholder="https://example.com"
                        className={`input input-bordered w-full ${errors.website ? 'input-error' : ''}`}
                        disabled={isUpdating}
                      />
                      <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    </div>
                    {errors.website && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.website}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Bio</span>
                  </label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    placeholder="Tell us about yourself..."
                    className="textarea textarea-bordered h-24"
                    disabled={isUpdating}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-1" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Change Password</h2>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Current Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`input input-bordered w-full pr-12 ${errors.currentPassword ? 'input-error' : ''}`}
                      disabled={isUpdating}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-5 h-5 text-base-content/40" />
                      ) : (
                        <Eye className="w-5 h-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.currentPassword}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`input input-bordered w-full pr-12 ${errors.newPassword ? 'input-error' : ''}`}
                      disabled={isUpdating}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-5 h-5 text-base-content/40" />
                      ) : (
                        <Eye className="w-5 h-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.newPassword}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Confirm New Password</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`input input-bordered w-full pr-12 ${errors.confirmPassword ? 'input-error' : ''}`}
                      disabled={isUpdating}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-5 h-5 text-base-content/40" />
                      ) : (
                        <Eye className="w-5 h-5 text-base-content/40" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                    </label>
                  )}
                </div>

                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg border-error">
            <div className="card-body">
              <h2 className="card-title text-error">Danger Zone</h2>
              <p className="text-base-content/60 mb-4">
                Once you delete your account, there is no going back. This will also delete all your projects and their users.
              </p>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-error"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Current Plan</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <div className={`badge ${getSubscriptionBadge(user?.subscription?.plan)} badge-lg`}>
                  {user?.subscription?.plan?.toUpperCase() || 'FREE'}
                </div>
                <div className={`badge ${user?.subscription?.status === 'active' ? 'badge-success' : 'badge-warning'} badge-lg`}>
                  {user?.subscription?.status || 'Active'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Projects Used</div>
                  <div className="stat-value text-sm">
                    {user?.stats?.totalProjects || 0} / {user?.limits?.maxProjects || 0}
                  </div>
                </div>
                
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">API Calls This Month</div>
                  <div className="stat-value text-sm">
                    {user?.stats?.totalAPICallsThisMonth?.toLocaleString() || 0} / {user?.limits?.maxAPICallsPerMonth?.toLocaleString() || 0}
                  </div>
                </div>
                
                <div className="stat bg-base-200 rounded-lg">
                  <div className="stat-title">Users Per Project</div>
                  <div className="stat-value text-sm">
                    Up to {user?.limits?.maxUsersPerProject?.toLocaleString() || 0}
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">Member since:</span>
                  <span>{formatDate(user?.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">Last login:</span>
                  <span>{formatDate(user?.lastLogin)}</span>
                </div>
                {user?.subscription?.currentPeriodEnd && (
                  <div className="flex justify-between">
                    <span className="text-base-content/60">Current period ends:</span>
                    <span>{formatDate(user.subscription.currentPeriodEnd)}</span>
                  </div>
                )}
              </div>

              {user?.subscription?.plan === 'free' && (
                <div className="alert alert-info mt-6">
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold">Upgrade to Pro</h3>
                    <p className="text-sm">
                      Get unlimited projects, 100,000 API calls per month, and priority support.
                    </p>
                  </div>
                </div>
              )}

              <div className="card-actions justify-end mt-6">
                <button className="btn btn-outline">
                  View Billing History
                </button>
                <button className="btn btn-primary">
                  {user?.subscription?.plan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;