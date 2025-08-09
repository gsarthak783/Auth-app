import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, FileText, Key, Save, Eye, ChevronLeft, CheckCircle, Info, Palette, X } from 'lucide-react';
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
      color: 'bg-success/10 text-success border-success/20'
    },
    emailVerification: {
      title: 'Email Verification',
      description: 'Sent when a user needs to verify their email address',
      icon: FileText,
      color: 'bg-warning/10 text-warning border-warning/20'
    },
    passwordReset: {
      title: 'Password Reset',
      description: 'Sent when a user requests a password reset',
      icon: Key,
      color: 'bg-error/10 text-error border-error/20'
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
      <div className="h-[600px] overflow-auto bg-gradient-to-br from-base-200 to-base-300 rounded-xl p-6">
        <div className="max-w-xl mx-auto">
          {/* Email Preview Container */}
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
            {/* Email Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-10 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
                  <Mail className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold">{project?.name || 'Your Project'}</h2>
              </div>
            </div>
            
            {/* Email Content */}
            <div className="p-10">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                {processedTemplate.heading}
              </h3>
              
              {selectedTemplate === 'welcome' && (
                <p className="text-gray-500 text-center mb-6 text-lg">Welcome to {project?.name || 'Your Project'}</p>
              )}
              
              <p className="text-gray-600 mb-8 text-center leading-relaxed">
                {processedTemplate.message}
              </p>
              
              {processedTemplate.buttonText && (
                <div className="text-center mb-8">
                  <button className="bg-gradient-to-r from-primary to-secondary text-white px-10 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                    {processedTemplate.buttonText}
                  </button>
                </div>
              )}
              
              {processedTemplate.expiryText && (
                <div className="bg-warning/10 border-l-4 border-warning p-5 mb-8 rounded-r-lg">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <Info className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    <span><strong>Important:</strong> {processedTemplate.expiryText}</span>
                  </p>
                </div>
              )}
              
              <div className="border-t pt-8 mt-8">
                <div 
                  className="text-center text-gray-500 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: processedTemplate.footerText }}
                />
              </div>
            </div>
          </div>
          
          {/* Email Client Frame */}
          <div className="mt-4 text-center text-xs text-base-content/50">
            <p>This is how your email will appear in most email clients</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/60">Loading email templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300 sticky top-0 z-10 backdrop-blur-lg bg-opacity-90">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/project/${projectId}`)}
                className="btn btn-ghost btn-sm gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Project
              </button>
              <div className="divider divider-horizontal m-0"></div>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary" />
                  Email Templates
                </h1>
                <p className="text-xs text-base-content/60">Customize how your emails look and feel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`btn btn-sm ${previewMode ? 'btn-primary' : 'btn-ghost'} gap-2`}
              >
                {previewMode ? (
                  <>
                    <X className="w-4 h-4" />
                    Edit Mode
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Preview
                  </>
                )}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !templates[selectedTemplate].enabled}
                className="btn btn-primary btn-sm gap-2"
              >
                {saving ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="container mx-auto px-4 mt-4">
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
            <CheckCircle className="w-5 h-5" />
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Template Selector */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-base-100 rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-4">
                Email Types
              </h2>
              <div className="space-y-2">
                {Object.entries(templateInfo).map(([key, info]) => {
                  const Icon = info.icon;
                  const isSelected = selectedTemplate === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedTemplate(key)}
                      className={`
                        w-full text-left p-4 rounded-xl transition-all duration-200
                        ${isSelected 
                          ? 'bg-primary/10 border-2 border-primary shadow-lg scale-[1.02]' 
                          : 'bg-base-200 hover:bg-base-300 border-2 border-transparent hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${info.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{info.title}</h3>
                          <p className="text-xs text-base-content/60 leading-relaxed">
                            {info.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Enable/Disable Toggle */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-medium">
                          {templates[key].enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <input
                          type="checkbox"
                          className="toggle toggle-sm toggle-primary"
                          checked={templates[key].enabled}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleTemplateChange('enabled', e.target.checked);
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Template Variables */}
              <div className="mt-6 p-4 bg-info/10 rounded-xl">
                <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-info" />
                  Template Variables
                </h3>
                <div className="space-y-2">
                  <div className="text-xs">
                    <code className="bg-base-300 px-2 py-1 rounded text-primary">{'{{projectName}}'}</code>
                    <p className="text-base-content/60 mt-1">Replaced with your project name</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editor/Preview */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-base-100 rounded-xl shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      {(() => {
                        const Icon = templateInfo[selectedTemplate].icon;
                        return <Icon className="w-5 h-5 text-primary" />;
                      })()}
                      {templateInfo[selectedTemplate].title}
                    </h2>
                    <p className="text-sm text-base-content/60 mt-1">
                      {previewMode ? 'Preview how your email will look' : 'Customize the content and appearance'}
                    </p>
                  </div>
                </div>

                {previewMode ? (
                  renderPreview()
                ) : (
                  <div className="space-y-6">
                    {/* Subject Line */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email Subject</span>
                        <span className="label-text-alt text-xs">What appears in the inbox</span>
                      </label>
                      <input
                        type="text"
                        value={templates[selectedTemplate].subject}
                        onChange={(e) => handleTemplateChange('subject', e.target.value)}
                        className="input input-bordered focus:input-primary"
                        placeholder="Enter email subject..."
                        disabled={!templates[selectedTemplate].enabled}
                      />
                    </div>

                    {/* Heading */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Main Heading</span>
                        <span className="label-text-alt text-xs">The primary message header</span>
                      </label>
                      <input
                        type="text"
                        value={templates[selectedTemplate].heading}
                        onChange={(e) => handleTemplateChange('heading', e.target.value)}
                        className="input input-bordered focus:input-primary"
                        placeholder="Enter main heading..."
                        disabled={!templates[selectedTemplate].enabled}
                      />
                    </div>

                    {/* Message Body */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Message Body</span>
                        <span className="label-text-alt text-xs">The main content of your email</span>
                      </label>
                      <textarea
                        value={templates[selectedTemplate].message}
                        onChange={(e) => handleTemplateChange('message', e.target.value)}
                        className="textarea textarea-bordered focus:textarea-primary min-h-[120px]"
                        placeholder="Write your message here..."
                        disabled={!templates[selectedTemplate].enabled}
                      />
                    </div>

                    {/* Button Text */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Button Text</span>
                        <span className="label-text-alt text-xs">Call-to-action button label</span>
                      </label>
                      <input
                        type="text"
                        value={templates[selectedTemplate].buttonText}
                        onChange={(e) => handleTemplateChange('buttonText', e.target.value)}
                        className="input input-bordered focus:input-primary"
                        placeholder="e.g., Get Started, Verify Email, Reset Password"
                        disabled={!templates[selectedTemplate].enabled}
                      />
                    </div>

                    {/* Button URL (Welcome only) */}
                    {selectedTemplate === 'welcome' && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Button Destination URL</span>
                          <span className="label-text-alt text-xs">Where users go when they click</span>
                        </label>
                        <input
                          type="url"
                          value={templates[selectedTemplate].buttonUrl}
                          onChange={(e) => handleTemplateChange('buttonUrl', e.target.value)}
                          className="input input-bordered focus:input-primary"
                          placeholder="https://your-website.com/get-started"
                          disabled={!templates[selectedTemplate].enabled}
                        />
                        <label className="label">
                          <span className="label-text-alt text-xs text-info">
                            💡 Tip: Direct users to your onboarding or dashboard page
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Expiry Notice (Password Reset only) */}
                    {selectedTemplate === 'passwordReset' && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold">Expiration Notice</span>
                          <span className="label-text-alt text-xs">Security reminder about link expiry</span>
                        </label>
                        <input
                          type="text"
                          value={templates[selectedTemplate].expiryText}
                          onChange={(e) => handleTemplateChange('expiryText', e.target.value)}
                          className="input input-bordered focus:input-primary"
                          placeholder="This link will expire in 1 hour"
                          disabled={!templates[selectedTemplate].enabled}
                        />
                      </div>
                    )}

                    {/* Footer */}
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold">Email Footer</span>
                        <span className="label-text-alt text-xs">Signature and closing message</span>
                      </label>
                      <textarea
                        value={templates[selectedTemplate].footerText}
                        onChange={(e) => handleTemplateChange('footerText', e.target.value)}
                        className="textarea textarea-bordered focus:textarea-primary min-h-[100px]"
                        placeholder="Best regards,&#10;The {{projectName}} Team"
                        disabled={!templates[selectedTemplate].enabled}
                      />
                      <label className="label">
                        <span className="label-text-alt text-xs">
                          💡 HTML supported: Use {'<br>'} for line breaks
                        </span>
                      </label>
                    </div>

                    {/* Template Status Alert */}
                    {!templates[selectedTemplate].enabled && (
                      <div className="alert alert-warning shadow-lg">
                        <Info className="w-5 h-5" />
                        <span>This template is disabled. Enable it to send emails of this type.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplates; 