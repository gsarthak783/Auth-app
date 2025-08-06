import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const createTransporter = () => {
  const config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  };

  // Debug logging for email configuration
  console.log('📧 Email Configuration:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user,
    passConfigured: !!config.auth.pass,
    passLength: config.auth.pass ? config.auth.pass.length : 0
  });

  return nodemailer.createTransport(config);
};

// Send email
export const sendEmail = async (to, subject, text, html) => {
  try {
    // Check if email is configured for development
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
      console.log('⚠️ Email not configured, skipping email sending in development mode');
      console.log(`📧 Would have sent email to ${to}: ${subject}`);
      return { messageId: 'dev-mode-skip' };
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };
    
    console.log('📬 Email options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      recipientDefined: !!mailOptions.to
    });
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // In development, don't fail the entire process if email fails
    if (process.env.NODE_ENV === 'development') {
      console.log('🚫 Email failed in development mode, continuing without email...');
      return { messageId: 'dev-mode-error', error: error.message };
    }
    throw error;
  }
};

// Send verification email
export const sendVerificationEmail = async (user, token, projectName = 'Auth System') => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}&email=${user.email}`;
  
  const subject = `Verify your email address - ${projectName}`;
  
  const text = `
    Hello ${user.firstName || user.username},
    
    Please verify your email address by clicking the link below:
    ${verificationUrl}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, please ignore this email.
    
    Best regards,
    ${projectName} Team
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
          <h1 style="color: #333; margin: 0;">${projectName}</h1>
        </div>
        
        <div style="padding: 40px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${user.firstName || user.username},
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Thank you for signing up! Please verify your email address by clicking the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:
            <br>
            <a href="${verificationUrl}" style="color: #007bff; word-break: break-all;">${verificationUrl}</a>
          </p>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #999; font-size: 14px;">
          <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(user.email, subject, text, html);
};

// Send password reset email
export const sendPasswordResetEmail = async (user, token, projectName = 'Auth System') => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${user.email}`;
  
  const subject = `Reset your password - ${projectName}`;
  
  const text = `
    Hello ${user.firstName || user.username},
    
    You requested a password reset. Click the link below to reset your password:
    ${resetUrl}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    ${projectName} Team
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
          <h1 style="color: #333; margin: 0;">${projectName}</h1>
        </div>
        
        <div style="padding: 40px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Reset Your Password</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${user.firstName || user.username},
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            You requested a password reset. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:
            <br>
            <a href="${resetUrl}" style="color: #dc3545; word-break: break-all;">${resetUrl}</a>
          </p>
          
          <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 30px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #999; font-size: 14px;">
          <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(user.email, subject, text, html);
};

// Send welcome email
export const sendWelcomeEmail = async (user, projectName = 'Auth System') => {
  console.log('🎉 Sending welcome email to:', { 
    email: user?.email, 
    firstName: user?.firstName, 
    username: user?.username,
    projectName 
  });
  
  if (!user?.email) {
    throw new Error('User email is required for sending welcome email');
  }
  
  const subject = `Welcome to ${projectName}!`;
  
  const text = `
    Hello ${user.firstName || user.username},
    
    Welcome to ${projectName}! Your account has been successfully created.
    
    You can now log in and start using our platform.
    
    If you have any questions, feel free to contact our support team.
    
    Best regards,
    ${projectName} Team
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome!</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
          <h1 style="color: #333; margin: 0;">${projectName}</h1>
        </div>
        
        <div style="padding: 40px 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${user.firstName || user.username},
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Welcome to ${projectName}! Your account has been successfully created and verified.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            You can now log in and start using our platform. If you have any questions, feel free to contact our support team.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/login" 
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Get Started
            </a>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #999; font-size: 14px;">
          <p>&copy; 2024 ${projectName}. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(user.email, subject, text, html);
};

// Send security alert email
export const sendSecurityAlertEmail = async (user, alertType, details, projectName = 'Auth System') => {
  const subject = `Security Alert - ${projectName}`;
  
  const text = `
    Hello ${user.firstName || user.username},
    
    We detected unusual activity on your account:
    
    Alert Type: ${alertType}
    Details: ${details}
    Time: ${new Date().toISOString()}
    
    If this was you, you can ignore this email. If not, please secure your account immediately.
    
    Best regards,
    ${projectName} Security Team
  `;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Security Alert</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="text-align: center; padding: 20px 0; border-bottom: 1px solid #eee;">
          <h1 style="color: #333; margin: 0;">${projectName}</h1>
        </div>
        
        <div style="padding: 40px 20px;">
          <h2 style="color: #dc3545; margin-bottom: 20px;">🔒 Security Alert</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Hello ${user.firstName || user.username},
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            We detected unusual activity on your account:
          </p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>Alert Type:</strong> ${alertType}</p>
            <p style="margin: 10px 0 0 0; color: #333;"><strong>Details:</strong> ${details}</p>
            <p style="margin: 10px 0 0 0; color: #333;"><strong>Time:</strong> ${new Date().toISOString()}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            If this was you, you can ignore this email. If not, please secure your account immediately by changing your password.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/security" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Secure My Account
            </a>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; border-top: 1px solid #eee; color: #999; font-size: 14px;">
          <p>&copy; 2024 ${projectName} Security Team. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return await sendEmail(user.email, subject, text, html);
};