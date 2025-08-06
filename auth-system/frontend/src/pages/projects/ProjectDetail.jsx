import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { projectId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-base-content mb-6">Project Details</h1>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Project ID: {projectId}</h2>
          <p>Project detail page coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;