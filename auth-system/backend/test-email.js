import dotenv from 'dotenv';
import { sendEmail } from './utils/email.js';

dotenv.config();

const testEmailConfig = async () => {
  console.log('🧪 Testing Email Configuration...\n');
  
  // Check environment variables
  console.log('📝 Environment Variables:');
  console.log(`EMAIL_HOST: ${process.env.EMAIL_HOST || 'NOT SET'}`);
  console.log(`EMAIL_PORT: ${process.env.EMAIL_PORT || 'NOT SET'}`);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER || 'NOT SET'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET (length: ' + process.env.EMAIL_PASS.length + ')' : 'NOT SET'}`);
  console.log(`EMAIL_FROM: ${process.env.EMAIL_FROM || 'NOT SET'}\n`);
  
  // Common issues and suggestions
  console.log('🔍 Common Issues & Solutions:');
  console.log('1. Gmail App Password should be 16 characters (format: xxxx xxxx xxxx xxxx)');
  console.log('2. Remove spaces from app password in .env file');
  console.log('3. Make sure 2-Factor Authentication is enabled on your Google account');
  console.log('4. Use your Gmail address as EMAIL_USER');
  console.log('5. EMAIL_HOST should be smtp.gmail.com');
  console.log('6. EMAIL_PORT should be 587 (or 465 for secure)\n');
  
  // Test email sending if configuration exists
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      console.log('📤 Attempting to send test email...');
      await sendEmail(
        process.env.EMAIL_USER, // Send to yourself
        'AuthSystem Email Test',
        'This is a test email from your AuthSystem application.',
        '<h1>AuthSystem Email Test</h1><p>This is a test email from your AuthSystem application.</p><p>If you receive this, your email configuration is working correctly!</p>'
      );
      console.log('✅ Email sent successfully!');
    } catch (error) {
      console.error('❌ Email test failed:', error.message);
      
      if (error.code === 'EAUTH') {
        console.log('\n🔧 Authentication Error Solutions:');
        console.log('1. Double-check your Gmail App Password (should be 16 characters)');
        console.log('2. Make sure there are no spaces in your app password');
        console.log('3. Regenerate a new app password from Google Account settings');
        console.log('4. Ensure 2FA is enabled on your Google account');
      }
    }
  } else {
    console.log('⚠️ Email configuration incomplete. Please set up your .env file.');
  }
};

// Example .env configuration
console.log('📋 Example .env Configuration for Gmail:');
console.log(`
# Add these to your auth-system/backend/.env file:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM="AuthSystem <your-email@gmail.com>"
`);

// testEmailConfig().catch(console.error); 