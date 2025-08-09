/**
 * Script to update existing projects with default email templates
 * Run this after deploying the email template feature
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const Project = require('../models/Project');

async function updateProjectEmailTemplates() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find all projects without email templates
    const projects = await Project.find({
      $or: [
        { emailTemplates: { $exists: false } },
        { 'emailTemplates.welcome': { $exists: false } }
      ]
    });

    console.log(`📋 Found ${projects.length} projects to update`);

    for (const project of projects) {
      // Set default email templates if not exists
      if (!project.emailTemplates) {
        project.emailTemplates = {};
      }

      // Set defaults for each template type
      const defaultTemplates = {
        welcome: {
          subject: 'Welcome to {{projectName}}!',
          heading: 'Welcome aboard!',
          message: 'We\'re excited to have you join us. Get started by exploring all the features we have to offer.',
          buttonText: 'Get Started',
          buttonUrl: project.website || '',
          footerText: 'Best regards,<br>The {{projectName}} Team',
          enabled: true
        },
        emailVerification: {
          subject: 'Verify your email for {{projectName}}',
          heading: 'Verify Your Email',
          message: 'Please click the button below to verify your email address and activate your account.',
          buttonText: 'Verify Email',
          footerText: 'If you didn\'t create an account, you can safely ignore this email.<br><br>Best regards,<br>The {{projectName}} Team',
          enabled: true
        },
        passwordReset: {
          subject: 'Reset your password for {{projectName}}',
          heading: 'Reset Your Password',
          message: 'You requested to reset your password. Click the button below to create a new password.',
          buttonText: 'Reset Password',
          footerText: 'If you didn\'t request this, you can safely ignore this email.<br><br>Best regards,<br>The {{projectName}} Team',
          expiryText: 'This link will expire in 1 hour.',
          enabled: true
        }
      };

      // Apply defaults for missing templates
      for (const [key, defaultTemplate] of Object.entries(defaultTemplates)) {
        if (!project.emailTemplates[key]) {
          project.emailTemplates[key] = defaultTemplate;
        }
      }

      await project.save();
      console.log(`✅ Updated project: ${project.name}`);
    }

    console.log('\n✨ All projects updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateProjectEmailTemplates(); 