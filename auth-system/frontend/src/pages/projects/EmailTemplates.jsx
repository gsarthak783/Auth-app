import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout/Layout';
import { Mail, FileText, Key, Save, Eye, ChevronLeft, CheckCircle, Info } from 'lucide-react';
import api from '../../utils/api';

const EmailTemplates = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('welcome');
  const [previewMode, setPreviewMode] = useState(false);
  const [project, setProject] = useState(null);
  const [templates, setTemplates] = useState({
    welcome: {
      subject: '',
      heading: '',
      message: '',
      buttonText: '',
      buttonUrl: '',
      footerText: '',
      enabled: true
    },
    emailVerification: {
      subject: '',
      heading: '',
      message: '',
      buttonText: '',
      footerText: '',
      enabled: true
    },
    passwordReset: {
      subject: '',
      heading: '',
      message: '',
      buttonText: '',
      footerText: '',
      expiryText: '',
      enabled: true
    }
  });

  const templateInfo = {
    welcome: {
      title: 'Welcome Email',
      description: 'Sent when a new user signs up without email verification',
      icon: Mail,
      color: 'text-success'
    },
    emailVerification: {
      title: 'Email Verification',
      description: 'Sent when a user needs to verify their email address',
      icon: FileText,
      color: 'text-warning'
    },
    passwordReset: {
      title: 'Password Reset',
      description: 'Sent when a user requests a password reset',
      icon: Key,
      color: 'text-error'
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [projectId]);

  const fetchTemplates = async () => {
    try {
      const response = await api.get(`/projects/${projectId}/email-templates`);
      setTemplates(response.data.data.emailTemplates);
      setProject({
        name: response.data.data.projectName,
        website: response.data.data.projectWebsite
      });
    } catch (error) {
      console.error('Error fetching templates:', error);
      setMessage({ type: 'error', text: 'Failed to load email templates' });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateChange = (field, value) => {
    setTemplates(prev => ({
      ...prev,
      [selectedTemplate]: {
        ...prev[selectedTemplate],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await api.put(`/projects/${projectId}/email-templates`, {
        templateType: selectedTemplate,
        templateData: templates[selectedTemplate]
      });
      
      setMessage({ type: 'success', text: 'Template saved successfully!' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving template:', error);
      setMessage({ type: 'error', text: 'Failed to save template' });
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = () => {
    const template = templates[selectedTemplate];
    const processedTemplate = {};
    
    // Replace {{projectName}} with actual project name
    Object.keys(template).forEach(key => {
      if (typeof template[key] === 'string') {
        processedTemplate[key] = template[key].replace(/{{projectName}}/g, project?.name || 'Your Project');
      } else {
        processedTemplate[key] = template[key];
      }
    });

    return (
      <div className="bg-base-200 rounded-lg p-4 h-full overflow-auto">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Email Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white text-center">
            <h2 className="text-2xl font-bold">{project?.name || 'Your Project'}</h2>
          </div>
          
          {/* Email Content */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              {processedTemplate.heading}
            </h3>
            
            {selectedTemplate === 'welcome' && (
              <p className="text-gray-600 text-center mb-4">Welcome to {project?.name || 'Your Project'}</p>
            )}
            
            <p className="text-gray-600 mb-6 text-center">
              {processedTemplate.message}
            </p>
            
            {processedTemplate.buttonText && (
              <div className="text-center mb-6">
                <button className="btn btn-primary px-8">
                  {processedTemplate.buttonText}
                </button>
              </div>
            )}
            
            {processedTemplate.expiryText && (
              <div className="bg-base-200 border-l-4 border-primary p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Important:</strong> {processedTemplate.expiryText}
                </p>
              </div>
            )}
            
            <div className="border-t pt-6 mt-6">
              <div 
                className="text-center text-gray-500 text-sm"
                dangerouslySetInnerHTML={{ __html: processedTemplate.footerText }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/project/${projectId}`)}
              className="btn btn-ghost btn-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-bold">Email Templates</h1>
              <p className="text-sm text-base-content/60">Customize email templates for your project</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} mb-6`}>
            <CheckCircle className="w-5 h-5" />
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-lg mb-4">Templates</h2>
                <div className="space-y-2">
                  {Object.entries(templateInfo).map(([key, info]) => {
                    const Icon = info.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedTemplate(key)}
                        className={`w-full text-left p-4 rounded-lg transition-all ${
                          selectedTemplate === key 
                            ? 'bg-primary/10 border-2 border-primary' 
                            : 'bg-base-200 hover:bg-base-300 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 ${info.color}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{info.title}</h3>
                            <p className="text-xs text-base-content/60 mt-1">{info.description}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="label cursor-pointer justify-start gap-2">
                            <input
                              type="checkbox"
                              className="toggle toggle-sm"
                              checked={templates[key].enabled}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleTemplateChange('enabled', e.target.checked);
                              }}
                            />
                            <span className="label-text text-xs">
                              {templates[key].enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </label>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Variables Info */}
            <div className="card bg-base-100 shadow-xl mt-4">
              <div className="card-body">
                <h3 className="card-title text-sm flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Available Variables
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="bg-base-200 p-3 rounded">
                    <code className="text-primary">{'{{projectName}}'}</code>
                    <p className="text-base-content/60 mt-1">Your project name</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Template Editor */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="card-title text-lg">
                    Edit {templateInfo[selectedTemplate].title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewMode(!previewMode)}
                      className={`btn btn-sm ${previewMode ? 'btn-primary' : 'btn-ghost'}`}
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn btn-primary btn-sm"
                    >
                      {saving ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Save
                    </button>
                  </div>
                </div>

                {previewMode ? (
                  renderPreview()
                ) : (
                  <div className="space-y-4">
                    {/* Subject */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-sm">Subject Line</span>
                      </label>
                      <input
                        type="text"
                        value={templates[selectedTemplate].subject}
                        onChange={(e) => handleTemplateChange('subject', e.target.value)}
                        className="input input-bordered text-sm"
                        placeholder="Email subject..."
                      />
                    </div>

                    {/* Heading */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-sm">Email Heading</span>
                      </label>
                      <input
                        type="text"
                        value={templates[selectedTemplate].heading}
                        onChange={(e) => handleTemplateChange('heading', e.target.value)}
                        className="input input-bordered text-sm"
                        placeholder="Main heading..."
                      />
                    </div>

                    {/* Message */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-sm">Message</span>
                      </label>
                      <textarea
                        value={templates[selectedTemplate].message}
                        onChange={(e) => handleTemplateChange('message', e.target.value)}
                        className="textarea textarea-bordered h-24 text-sm"
                        placeholder="Email message..."
                      />
                    </div>

                    {/* Button Text */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-sm">Button Text</span>
                      </label>
                      <input
                        type="text"
                        value={templates[selectedTemplate].buttonText}
                        onChange={(e) => handleTemplateChange('buttonText', e.target.value)}
                        className="input input-bordered text-sm"
                        placeholder="Call to action button text..."
                      />
                    </div>

                    {/* Button URL (Welcome only) */}
                    {selectedTemplate === 'welcome' && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-sm">Button URL</span>
                        </label>
                        <input
                          type="url"
                          value={templates[selectedTemplate].buttonUrl}
                          onChange={(e) => handleTemplateChange('buttonUrl', e.target.value)}
                          className="input input-bordered text-sm"
                          placeholder="https://your-website.com"
                        />
                        <label className="label">
                          <span className="label-text-alt text-xs">Where users go when they click "Get Started"</span>
                        </label>
                      </div>
                    )}

                    {/* Expiry Text (Password Reset only) */}
                    {selectedTemplate === 'passwordReset' && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium text-sm">Expiry Notice</span>
                        </label>
                        <input
                          type="text"
                          value={templates[selectedTemplate].expiryText}
                          onChange={(e) => handleTemplateChange('expiryText', e.target.value)}
                          className="input input-bordered text-sm"
                          placeholder="This link will expire in..."
                        />
                      </div>
                    )}

                    {/* Footer Text */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium text-sm">Footer Text</span>
                      </label>
                      <textarea
                        value={templates[selectedTemplate].footerText}
                        onChange={(e) => handleTemplateChange('footerText', e.target.value)}
                        className="textarea textarea-bordered h-20 text-sm"
                        placeholder="Email footer/signature..."
                      />
                      <label className="label">
                        <span className="label-text-alt text-xs">HTML tags like {'<br>'} are supported</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmailTemplates; 