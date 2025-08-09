import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../contexts/ProjectsContext';
import {
  ArrowLeft,
  Globe,
  Shield,
  Key,
  Mail,
  Clock,
  Users,
  Settings,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateProject = () => {
  const navigate = useNavigate();
  const { user, canCreateProject, getRemainingProjects } = useAuth();
  const { createProject, isLoading } = useProjects();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    allowedDomains: ['localhost', '127.0.0.1'],
    allowedOrigins: ['http://localhost:3000', 'http://localhost:5173'],

    // Authentication Settings
    allowSignup: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,

    // Session Settings
    sessionTimeout: 15, // minutes
    maxSessions: 5,
    enableTwoFactor: false,
    enableAccountLocking: true,
    maxLoginAttempts: 5,
    lockoutDuration: 120, // minutes

    // Email Templates
    emailTemplates: {
      welcome: {
        subject: 'Welcome to {{projectName}}!',
        enabled: true
      },
      verification: {
        subject: 'Verify your email for {{projectName}}',
        enabled: true
      },
      passwordReset: {
        subject: 'Reset your password for {{projectName}}',
        enabled: true
      }
    },

    // OAuth Providers (for future implementation)
    oauthProviders: {
      google: { enabled: false, clientId: '', clientSecret: '' },
      facebook: { enabled: false, clientId: '', clientSecret: '' },
      github: { enabled: false, clientId: '', clientSecret: '' }
    }
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested object properties
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
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
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

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Project name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Project name must be at least 2 characters';
      }

      if (formData.description && formData.description.length > 500) {
        newErrors.description = 'Description cannot exceed 500 characters';
      }

      const invalidDomains = formData.allowedDomains.filter(domain => 
        domain.trim() && !/^[a-zA-Z0-9.-]+$/.test(domain.trim())
      );
      if (invalidDomains.length > 0) {
        newErrors.allowedDomains = 'Invalid domain format';
      }

      const invalidOrigins = formData.allowedOrigins.filter(origin => 
        origin.trim() && !/^https?:\/\/.+/.test(origin.trim())
      );
      if (invalidOrigins.length > 0) {
        newErrors.allowedOrigins = 'Origins must be valid URLs (http:// or https://)';
      }
    }

    if (step === 2) {
      if (formData.minPasswordLength < 4 || formData.minPasswordLength > 50) {
        newErrors.minPasswordLength = 'Password length must be between 4 and 50 characters';
      }

      if (formData.maxLoginAttempts < 1 || formData.maxLoginAttempts > 20) {
        newErrors.maxLoginAttempts = 'Max login attempts must be between 1 and 20';
      }

      if (formData.lockoutDuration < 1 || formData.lockoutDuration > 1440) {
        newErrors.lockoutDuration = 'Lockout duration must be between 1 and 1440 minutes';
      }
    }

    if (step === 3) {
      if (formData.sessionTimeout < 5 || formData.sessionTimeout > 1440) {
        newErrors.sessionTimeout = 'Session timeout must be between 5 and 1440 minutes';
      }

      if (formData.maxSessions < 1 || formData.maxSessions > 20) {
        newErrors.maxSessions = 'Max sessions must be between 1 and 20';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      return;
    }

    try {
      // Clean up the form data
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        allowedDomains: formData.allowedDomains.filter(domain => domain.trim()),
        allowedOrigins: formData.allowedOrigins.filter(origin => origin.trim()),
        settings: {
          allowSignup: formData.allowSignup,
          requireEmailVerification: formData.requireEmailVerification,
          minPasswordLength: formData.minPasswordLength,
          requireUppercase: formData.requireUppercase,
          requireLowercase: formData.requireLowercase,
          requireNumbers: formData.requireNumbers,
          requireSpecialChars: formData.requireSpecialChars,
          sessionTimeout: formData.sessionTimeout,
          maxSessions: formData.maxSessions,
          enableTwoFactor: formData.enableTwoFactor,
          enableAccountLocking: formData.enableAccountLocking,
          maxLoginAttempts: formData.maxLoginAttempts,
          lockoutDuration: formData.lockoutDuration
        },
        emailTemplates: formData.emailTemplates,
        oauthProviders: formData.oauthProviders
      };

      const newProject = await createProject(projectData);
      navigate(`/project/${newProject.id}`);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  // Check if user can create projects
  if (!canCreateProject()) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-16">
            <AlertCircle className="w-16 h-16 mx-auto text-warning mb-4" />
            <h2 className="text-2xl font-bold mb-2">Project Limit Reached</h2>
            <p className="text-base-content/60 mb-6">
              You've reached the maximum number of projects for your current plan.
              You have {user?.stats?.totalProjects || 0} of {user?.limits?.maxProjects || 0} projects.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-outline"
              >
                Back to Dashboard
              </button>
              <button className="btn btn-primary">
                Upgrade Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const steps = [
    { number: 1, title: 'Basic Info', icon: Globe },
    { number: 2, title: 'Authentication', icon: Shield },
    { number: 3, title: 'Sessions', icon: Clock },
    { number: 4, title: 'Review', icon: CheckCircle }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-ghost btn-sm"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-base-content">Create New Project</h1>
          <p className="text-base-content/60">
            Set up authentication for your application
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="steps steps-horizontal w-full mb-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className={`step ${currentStep >= step.number ? 'step-primary' : ''}`}
            >
              <div className="flex flex-col items-center">
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{step.title}</span>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Basic Information</h2>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Project Name *</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="My Awesome App"
                    className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what this project is for..."
                    className={`textarea textarea-bordered w-full h-24 ${errors.description ? 'textarea-error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.description}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Allowed Domains</span>
                    <span className="label-text-alt">Domains that can use this project</span>
                  </label>
                  {formData.allowedDomains.map((domain, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={domain}
                        onChange={(e) => handleArrayChange('allowedDomains', index, e.target.value)}
                        placeholder="example.com"
                        className="input input-bordered flex-1"
                        disabled={isLoading}
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
                  {errors.allowedDomains && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.allowedDomains}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Allowed Origins</span>
                    <span className="label-text-alt">URLs that can make requests to your API</span>
                  </label>
                  {formData.allowedOrigins.map((origin, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={origin}
                        onChange={(e) => handleArrayChange('allowedOrigins', index, e.target.value)}
                        placeholder="https://example.com"
                        className="input input-bordered flex-1"
                        disabled={isLoading}
                      />
                      {formData.allowedOrigins.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('allowedOrigins', index)}
                          className="btn btn-outline btn-error btn-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem('allowedOrigins')}
                    className="btn btn-outline btn-sm"
                  >
                    Add Origin
                  </button>
                  {errors.allowedOrigins && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.allowedOrigins}</span>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Authentication Settings */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Authentication Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Allow User Registration</span>
                      <input
                        type="checkbox"
                        name="allowSignup"
                        checked={formData.allowSignup}
                        onChange={handleChange}
                        className="checkbox checkbox-primary"
                        disabled={isLoading}
                      />
                    </label>
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Require Email Verification</span>
                      <input
                        type="checkbox"
                        name="requireEmailVerification"
                        checked={formData.requireEmailVerification}
                        onChange={handleChange}
                        className="checkbox checkbox-primary"
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Minimum Password Length</span>
                  </label>
                  <input
                    type="number"
                    name="minPasswordLength"
                    value={formData.minPasswordLength}
                    onChange={handleChange}
                    min="4"
                    max="50"
                    className={`input input-bordered w-full ${errors.minPasswordLength ? 'input-error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.minPasswordLength && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.minPasswordLength}</span>
                    </label>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Password Requirements</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Require Uppercase</span>
                        <input
                          type="checkbox"
                          name="requireUppercase"
                          checked={formData.requireUppercase}
                          onChange={handleChange}
                          className="checkbox checkbox-primary"
                          disabled={isLoading}
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Require Lowercase</span>
                        <input
                          type="checkbox"
                          name="requireLowercase"
                          checked={formData.requireLowercase}
                          onChange={handleChange}
                          className="checkbox checkbox-primary"
                          disabled={isLoading}
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Require Numbers</span>
                        <input
                          type="checkbox"
                          name="requireNumbers"
                          checked={formData.requireNumbers}
                          onChange={handleChange}
                          className="checkbox checkbox-primary"
                          disabled={isLoading}
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Require Special Characters</span>
                        <input
                          type="checkbox"
                          name="requireSpecialChars"
                          checked={formData.requireSpecialChars}
                          onChange={handleChange}
                          className="checkbox checkbox-primary"
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Max Login Attempts</span>
                    </label>
                    <input
                      type="number"
                      name="maxLoginAttempts"
                      value={formData.maxLoginAttempts}
                      onChange={handleChange}
                      min="1"
                      max="20"
                      className={`input input-bordered w-full ${errors.maxLoginAttempts ? 'input-error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.maxLoginAttempts && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.maxLoginAttempts}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Lockout Duration (minutes)</span>
                    </label>
                    <input
                      type="number"
                      name="lockoutDuration"
                      value={formData.lockoutDuration}
                      onChange={handleChange}
                      min="1"
                      max="1440"
                      className={`input input-bordered w-full ${errors.lockoutDuration ? 'input-error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.lockoutDuration && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.lockoutDuration}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Enable Account Locking</span>
                    <input
                      type="checkbox"
                      name="enableAccountLocking"
                      checked={formData.enableAccountLocking}
                      onChange={handleChange}
                      className="checkbox checkbox-primary"
                      disabled={isLoading}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Step 3: Session Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Session & Security</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Session Timeout (minutes)</span>
                    </label>
                    <input
                      type="number"
                      name="sessionTimeout"
                      value={formData.sessionTimeout}
                      onChange={handleChange}
                      min="5"
                      max="1440"
                      className={`input input-bordered w-full ${errors.sessionTimeout ? 'input-error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.sessionTimeout && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.sessionTimeout}</span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Max Concurrent Sessions</span>
                    </label>
                    <input
                      type="number"
                      name="maxSessions"
                      value={formData.maxSessions}
                      onChange={handleChange}
                      min="1"
                      max="20"
                      className={`input input-bordered w-full ${errors.maxSessions ? 'input-error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.maxSessions && (
                      <label className="label">
                        <span className="label-text-alt text-error">{errors.maxSessions}</span>
                      </label>
                    )}
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text">Enable Two-Factor Authentication</span>
                    <input
                      type="checkbox"
                      name="enableTwoFactor"
                      checked={formData.enableTwoFactor}
                      onChange={handleChange}
                      className="checkbox checkbox-primary"
                      disabled={isLoading}
                    />
                  </label>
                </div>

                <div className="divider">Email Templates</div>

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
                        disabled={isLoading}
                      />
                    </label>
                    {formData.emailTemplates.welcome.enabled && (
                      <input
                        type="text"
                        name="emailTemplates.welcome.subject"
                        value={formData.emailTemplates.welcome.subject}
                        onChange={handleChange}
                        placeholder="Welcome email subject"
                        className="input input-bordered w-full mt-2"
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                    </label>
                    {formData.emailTemplates.verification.enabled && (
                      <input
                        type="text"
                        name="emailTemplates.verification.subject"
                        value={formData.emailTemplates.verification.subject}
                        onChange={handleChange}
                        placeholder="Verification email subject"
                        className="input input-bordered w-full mt-2"
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                    </label>
                    {formData.emailTemplates.passwordReset.enabled && (
                      <input
                        type="text"
                        name="emailTemplates.passwordReset.subject"
                        value={formData.emailTemplates.passwordReset.subject}
                        onChange={handleChange}
                        placeholder="Password reset email subject"
                        className="input input-bordered w-full mt-2"
                        disabled={isLoading}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Review & Create</h2>
                </div>

                <div className="alert alert-info">
                  <Info className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold">Ready to Create Project</h3>
                    <p className="text-sm">
                      Review your settings below. You can change these later in project settings.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title text-lg">Basic Info</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {formData.name}</div>
                        <div><strong>Description:</strong> {formData.description || 'None'}</div>
                        <div><strong>Domains:</strong> {formData.allowedDomains.join(', ')}</div>
                        <div><strong>Origins:</strong> {formData.allowedOrigins.join(', ')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title text-lg">Authentication</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Allow Signup:</strong> {formData.allowSignup ? 'Yes' : 'No'}</div>
                        <div><strong>Email Verification:</strong> {formData.requireEmailVerification ? 'Required' : 'Optional'}</div>
                        <div><strong>Min Password Length:</strong> {formData.minPasswordLength} characters</div>
                        <div><strong>Max Login Attempts:</strong> {formData.maxLoginAttempts}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title text-lg">Sessions</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Session Timeout:</strong> {formData.sessionTimeout} minutes</div>
                        <div><strong>Max Sessions:</strong> {formData.maxSessions}</div>
                        <div><strong>Two-Factor:</strong> {formData.enableTwoFactor ? 'Enabled' : 'Disabled'}</div>
                        <div><strong>Account Locking:</strong> {formData.enableAccountLocking ? 'Enabled' : 'Disabled'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="card-title text-lg">Email Templates</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Welcome Email:</strong> {formData.emailTemplates.welcome.enabled ? 'Enabled' : 'Disabled'}</div>
                        <div><strong>Verification Email:</strong> {formData.emailTemplates.verification.enabled ? 'Enabled' : 'Disabled'}</div>
                        <div><strong>Password Reset:</strong> {formData.emailTemplates.passwordReset.enabled ? 'Enabled' : 'Disabled'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <h3 className="font-semibold">Important</h3>
                    <p className="text-sm">
                      After creating your project, you'll receive API keys that you'll need to integrate with your application.
                      Keep these keys secure and never expose them in client-side code.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="card-actions justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                className={`btn btn-outline ${currentStep === 1 ? 'btn-disabled' : ''}`}
                disabled={currentStep === 1 || isLoading}
              >
                Previous
              </button>

              <div className="flex gap-2">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Creating Project...
                      </>
                    ) : (
                      'Create Project'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;