const getEmailTemplate = (type, data) => {
  const baseStyles = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      
      body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #f7f7f7;
      }
      
      .email-wrapper {
        width: 100%;
        background-color: #f7f7f7;
        padding: 40px 20px;
      }
      
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        overflow: hidden;
      }
      
      .email-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 40px 30px;
        text-align: center;
        color: white;
      }
      
      .logo {
        font-size: 32px;
        font-weight: 700;
        color: white;
        text-decoration: none;
        display: inline-block;
        margin-bottom: 10px;
      }
      
      .email-content {
        padding: 40px;
      }
      
      h1 {
        color: #1a1a1a;
        font-size: 28px;
        font-weight: 700;
        margin: 0 0 10px 0;
        text-align: center;
      }
      
      .subtitle {
        color: #666666;
        font-size: 16px;
        text-align: center;
        margin-bottom: 30px;
      }
      
      .message {
        color: #4a4a4a;
        font-size: 16px;
        line-height: 1.8;
        margin-bottom: 30px;
        text-align: center;
      }
      
      .button-container {
        text-align: center;
        margin: 35px 0;
      }
      
      .button {
        display: inline-block;
        padding: 14px 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white !important;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        transition: all 0.3s ease;
      }
      
      .button:hover {
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        transform: translateY(-1px);
      }
      
      .divider {
        height: 1px;
        background-color: #e0e0e0;
        margin: 30px 0;
      }
      
      .footer {
        text-align: center;
        color: #888888;
        font-size: 14px;
        line-height: 1.6;
      }
      
      .footer-text {
        margin-bottom: 20px;
      }
      
      .security-notice {
        background-color: #f8f9fa;
        border-left: 4px solid #667eea;
        padding: 15px 20px;
        margin: 25px 0;
        border-radius: 4px;
        font-size: 14px;
        color: #555555;
      }
      
      .link-text {
        color: #667eea;
        text-decoration: none;
        font-weight: 500;
      }
      
      .link-text:hover {
        text-decoration: underline;
      }
      
      @media only screen and (max-width: 600px) {
        .email-container {
          width: 100% !important;
          border-radius: 0;
        }
        
        .email-header {
          padding: 30px 20px 25px;
        }
        
        .email-content {
          padding: 30px 20px;
        }
        
        h1 {
          font-size: 24px;
        }
        
        .button {
          padding: 12px 28px;
          font-size: 15px;
        }
      }
    </style>
  `;

  const baseHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.subject}</title>
      ${baseStyles}
    </head>
    <body>
      <div class="email-wrapper">
        <div class="email-container">
          <div class="email-header">
            <a href="${data.projectUrl || '#'}" class="logo">${data.projectName}</a>
          </div>
          <div class="email-content">
            ${data.content}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const templates = {
    welcome: `
      <h1>${data.heading}</h1>
      <div class="subtitle">Welcome to ${data.projectName}</div>
      
      <div class="message">
        ${data.message}
      </div>
      
      ${data.buttonUrl ? `
        <div class="button-container">
          <a href="${data.buttonUrl}" class="button">${data.buttonText}</a>
        </div>
      ` : ''}
      
      <div class="divider"></div>
      
      <div class="footer">
        <div class="footer-text">${data.footerText}</div>
      </div>
    `,
    
    emailVerification: `
      <h1>${data.heading}</h1>
      
      <div class="message">
        ${data.message}
      </div>
      
      <div class="button-container">
        <a href="${data.verificationUrl}" class="button">${data.buttonText}</a>
      </div>
      
      <div class="security-notice">
        <strong>Security tip:</strong> This verification link is unique to your email address. 
        Do not share it with anyone.
      </div>
      
      <div class="divider"></div>
      
      <div class="footer">
        <div class="footer-text">${data.footerText}</div>
      </div>
    `,
    
    passwordReset: `
      <h1>${data.heading}</h1>
      
      <div class="message">
        ${data.message}
      </div>
      
      <div class="button-container">
        <a href="${data.resetUrl}" class="button">${data.buttonText}</a>
      </div>
      
      <div class="security-notice">
        <strong>Important:</strong> ${data.expiryText}
        <br><br>
        For security reasons, this password reset link can only be used once.
      </div>
      
      <div class="divider"></div>
      
      <div class="footer">
        <div class="footer-text">${data.footerText}</div>
      </div>
    `
  };

  // Replace template variables
  let content = templates[type] || templates.welcome;
  content = content.replace(/{{projectName}}/g, data.projectName);
  
  // Insert content into base HTML
  let html = baseHTML.replace('${data.subject}', data.subject);
  html = html.replace('${data.projectName}', data.projectName);
  html = html.replace('${data.projectUrl || \'#\'}', data.projectUrl || '#');
  html = html.replace('${data.content}', content);
  
  return html;
};

// Helper function to prepare email data with project template settings
const prepareEmailData = (project, templateType, additionalData) => {
  const template = project.emailTemplates[templateType];
  const projectName = project.name;
  
  // Replace {{projectName}} in all template fields
  const processedTemplate = {};
  Object.keys(template).forEach(key => {
    if (typeof template[key] === 'string') {
      processedTemplate[key] = template[key].replace(/{{projectName}}/g, projectName);
    } else {
      processedTemplate[key] = template[key];
    }
  });
  
  return {
    projectName,
    projectUrl: project.website,
    ...processedTemplate,
    ...additionalData
  };
};

module.exports = {
  getEmailTemplate,
  prepareEmailData
}; 