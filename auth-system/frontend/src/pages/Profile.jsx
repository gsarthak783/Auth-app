import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-base-content mb-6">Profile</h1>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">User Information</h2>
          <div className="space-y-2">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Username:</strong> {user?.username}</p>
            <p><strong>First Name:</strong> {user?.firstName || 'Not set'}</p>
            <p><strong>Last Name:</strong> {user?.lastName || 'Not set'}</p>
            <p><strong>Verified:</strong> {user?.isVerified ? 'Yes' : 'No'}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;