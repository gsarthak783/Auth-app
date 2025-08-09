const nodemailer = require('nodemailer');
const { getEmailTemplate, prepareEmailData } = require('./emailTemplates');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send welcome email with custom template
const sendWelcomeEmail = async (user, project) => {
  if (!project.emailTemplates.welcome.enabled) {
    return;
  }

  const emailData = prepareEmailData(project, 'welcome', {
    userName: user.firstName || user.username || 'there'
  });

  const html = getEmailTemplate('welcome', emailData);

  const mailOptions = {
    from: `"${project.name}" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: emailData.subject,
    html
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

// Send verification email with custom template
const sendVerificationEmail = async (user, verificationToken, project) => {
  if (!project.emailTemplates.emailVerification.enabled) {
    return;
  }

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&projectId=${project._id}`;
  
  const emailData = prepareEmailData(project, 'emailVerification', {
    verificationUrl,
    userName: user.firstName || user.username || 'there'
  });

  const html = getEmailTemplate('emailVerification', emailData);

  const mailOptions = {
    from: `"${project.name}" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: emailData.subject,
    html
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email with custom template
const sendPasswordResetEmail = async (user, resetToken, project) => {
  if (!project.emailTemplates.passwordReset.enabled) {
    return;
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&projectId=${project._id}`;
  
  const emailData = prepareEmailData(project, 'passwordReset', {
    resetUrl,
    userName: user.firstName || user.username || 'there'
  });

  const html = getEmailTemplate('passwordReset', emailData);

  const mailOptions = {
    from: `"${project.name}" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: emailData.subject,
    html
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Legacy functions for platform users (not project users)
const sendPlatformWelcomeEmail = async (user) => {
  const mailOptions = {
    from: `"AccessKit" <${process.env.EMAIL_FROM}>`,
    to: user.email,
    subject: 'Welcome to AccessKit!',
    html: `
      <h2>Welcome to AccessKit, ${user.firstName}!</h2>
      <p>Your account has been created successfully.</p>
      <p>You can now create projects and start using our authentication services.</p>
      <p>Best regards,<br>The AccessKit Team</p>
    `
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending platform welcome email:', error);
  }
};

const sendPlatformPasswordResetEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: `"AccessKit" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Reset Your Password - AccessKit',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to create a new password:</p>
      <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The AccessKit Team</p>
    `
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending platform password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPlatformWelcomeEmail,
  sendPlatformPasswordResetEmail
};