import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderOpen } from 'lucide-react';

const Projects = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-base-content">Projects</h1>
        <Link to="/projects/create" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Project
        </Link>
      </div>
      
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="text-center py-8">
            <FolderOpen className="w-16 h-16 text-base-content/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
            <p className="text-base-content/60 mb-4">Create your first project to get started</p>
            <Link to="/projects/create" className="btn btn-primary">
              Create Project
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;