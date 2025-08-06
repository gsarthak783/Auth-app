import React from 'react';
import { Link } from 'react-router-dom';

const CreateProject = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-base-content mb-6">Create New Project</h1>
      <div className="card bg-base-100 shadow-lg max-w-2xl">
        <div className="card-body">
          <h2 className="card-title">Project Details</h2>
          <p>Create project page coming soon!</p>
          <div className="card-actions justify-end mt-4">
            <Link to="/projects" className="btn btn-ghost">Cancel</Link>
            <button className="btn btn-primary">Create Project</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;