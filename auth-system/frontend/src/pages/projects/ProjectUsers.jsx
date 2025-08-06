import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectUsers = () => {
  const { projectId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-base-content mb-6">Project Users</h1>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Users for Project: {projectId}</h2>
          <p>Project users page coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectUsers;