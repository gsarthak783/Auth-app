import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectsContext';
import {
  ArrowLeft,
  Save,
  Shield,
  Mail,
  Globe,
  Users,
  Clock,
  Key,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const ProjectSettings = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { 
    currentProject, 
    getProject, 
    updateProject, 
    deleteProject,
    regenerateApiKeys,
    isLoading 
  } = useProjects();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    allowedDomains: [],
    allowedOrigins: [],
    settings: {
      allowSignup: true,
      requireEmailVerification: false,
      minPasswordLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
      sessionTimeout: 15,
      maxSessions: 5,
      enableTwoFactor: false,
      enableAccountLocking: true,
      maxLoginAttempts: 5,
      lockoutDuration: 120
    },
    emailTemplates: {
      welcome: { enabled: true, subject: '' },
      verification: { enabled: true, subject: '' },
      passwordReset: { enabled: true, subject: '' }
    }
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  useEffect(() => {
    if (currentProject) {
      setFormData({
        name: currentProject.name || '',
        description: currentProject.description || '',
        isActive: currentProject.isActive,
        allowedDomains: currentProject.allowedDomains || [],
        allowedOrigins: currentProject.allowedOrigins || [],
        settings: {
          ...formData.settings,
          ...currentProject.settings
        },
        emailTemplates: {
          ...formData.emailTemplates,
          ...currentProject.emailTemplates
        }
      });
    }
  }, [currentProject]);

  const loadProject = async () => {
    try {
      await getProject(projectId);
    } catch (error) {
      console.error('Failed to load project:', error);
      navigate('/projects');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : 
                                        type === 'number' ? parseInt(value) || 0 : value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
                type === 'number' ? parseInt(value) || 0 : value
      }));
    }
  };

  const handleArrayChange = (fieldName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeArrayItem = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setIsUpdating(true);
      await updateProject(projectId, formData);
      toast.success('Project settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update project settings');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRegenerateKeys = async () => {
    if (window.confirm('Are you sure you want to regenerate API keys? This will invalidate the current keys and may break existing integrations.')) {
      try {
        await regenerateApiKeys(projectId);
        toast.success('API keys regenerated successfully');
      } catch (error) {
        toast.error('Failed to regenerate API keys');
      }
    }
  };

  const handleDeleteProject = async () => {
    const confirmation = window.prompt(
      `This action cannot be undone. Type "${currentProject?.name}" to confirm deletion:`
    );
    
    if (confirmation !== currentProject?.name) {
      toast.error('Project name does not match');
      return;
    }

    try {
      await deleteProject(projectId);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (isLoading || !currentProject) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(`/project/${projectId}`)}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-base-content">Project Settings</h1>
          <p className="text-base-content/60 mt-1">
            Configure authentication settings for {currentProject.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Settings */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Basic Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Project Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered"
                  disabled={isUpdating}
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Project Active</span>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                    disabled={isUpdating}
                  />
                </label>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered h-24"
                disabled={isUpdating}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Allowed Domains</span>
              </label>
              {formData.allowedDomains.map((domain, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => handleArrayChange('allowedDomains', index, e.target.value)}
                    className="input input-bordered flex-1"
                    disabled={isUpdating}
                  />
                  {formData.allowedDomains.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('allowedDomains', index)}
                      className="btn btn-outline btn-error btn-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('allowedDomains')}
                className="btn btn-outline btn-sm"
              >
                Add Domain
              </button>
            </div>
          </div>
        </div>

        {/* Authentication Settings */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Authentication Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Allow User Registration</span>
                  <input
                    type="checkbox"
                    name="settings.allowSignup"
                    checked={formData.settings.allowSignup}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                    disabled={isUpdating}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Require Email Verification</span>
                  <input
                    type="checkbox"
                    name="settings.requireEmailVerification"
                    checked={formData.settings.requireEmailVerification}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                    disabled={isUpdating}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Enable Account Locking</span>
                  <input
                    type="checkbox"
                    name="settings.enableAccountLocking"
                    checked={formData.settings.enableAccountLocking}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                    disabled={isUpdating}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Enable Two-Factor Auth</span>
                  <input
                    type="checkbox"
                    name="settings.enableTwoFactor"
                    checked={formData.settings.enableTwoFactor}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                    disabled={isUpdating}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Min Password Length</span>
                </label>
                <input
                  type="number"
                  name="settings.minPasswordLength"
                  value={formData.settings.minPasswordLength}
                  onChange={handleChange}
                  min="4"
                  max="50"
                  className="input input-bordered"
                  disabled={isUpdating}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Max Login Attempts</span>
                </label>
                <input
                  type="number"
                  name="settings.maxLoginAttempts"
                  value={formData.settings.maxLoginAttempts}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="input input-bordered"
                  disabled={isUpdating}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Session Timeout (min)</span>
                </label>
                <input
                  type="number"
                  name="settings.sessionTimeout"
                  value={formData.settings.sessionTimeout}
                  onChange={handleChange}
                  min="5"
                  max="1440"
                  className="input input-bordered"
                  disabled={isUpdating}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Templates
            </h2>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Welcome Email</span>
                  <input
                    type="checkbox"
                    name="emailTemplates.welcome.enabled"
                    checked={formData.emailTemplates.welcome.enabled}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                    disabled={isUpdating}
                  />
                </label>
                {formData.emailTemplates.welcome.enabled && (
                  <input
                    type="text"
                    name="emailTemplates.welcome.subject"
                    value={formData.emailTemplates.welcome.subject}
                    onChange={handleChange}
                    placeholder="Welcome to {{projectName}}!"
                    className="input input-bordered w-full mt-2"
                    disabled={isUpdating}
                  />
                )}
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Email Verification</span>
                  <input
                    type="checkbox"
                    name="emailTemplates.verification.enabled"
                    checked={formData.emailTemplates.verification.enabled}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                    disabled={isUpdating}
                  />
                </label>
                {formData.emailTemplates.verification.enabled && (
                  <input
                    type="text"
                    name="emailTemplates.verification.subject"
                    value={formData.emailTemplates.verification.subject}
                    onChange={handleChange}
                    placeholder="Verify your email for {{projectName}}"
                    className="input input-bordered w-full mt-2"
                    disabled={isUpdating}
                  />
                )}
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Password Reset</span>
                  <input
                    type="checkbox"
                    name="emailTemplates.passwordReset.enabled"
                    checked={formData.emailTemplates.passwordReset.enabled}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                    disabled={isUpdating}
                  />
                </label>
                {formData.emailTemplates.passwordReset.enabled && (
                  <input
                    type="text"
                    name="emailTemplates.passwordReset.subject"
                    value={formData.emailTemplates.passwordReset.subject}
                    onChange={handleChange}
                    placeholder="Reset your password for {{projectName}}"
                    className="input input-bordered w-full mt-2"
                    disabled={isUpdating}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* API Keys */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Keys
              </h2>
              <button
                type="button"
                onClick={handleRegenerateKeys}
                className="btn btn-outline btn-sm"
              >
                Regenerate Keys
              </button>
            </div>

            <div className="alert alert-warning">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Security Notice</h3>
                <p className="text-sm">
                  API keys are sensitive. Regenerating them will invalidate existing integrations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card bg-base-100 shadow-lg border-error">
          <div className="card-body">
            <h2 className="card-title text-error flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-base-content/60 mb-4">
              Once you delete a project, there is no going back. This will also delete all project users and their data.
            </p>
            <button
              type="button"
              onClick={handleDeleteProject}
              className="btn btn-error"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete Project
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
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
  );
};

export default ProjectSettings;