import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { generateApiSecret } from '../utils/jwt.js';

dotenv.config();

const seedDemoData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Create demo admin user
    const existingAdmin = await User.findOne({ email: 'admin@demo.com' });
    
    let adminUser;
    if (!existingAdmin) {
      adminUser = new User({
        email: 'admin@demo.com',
        username: 'admin',
        password: 'admin123', // Will be hashed automatically
        firstName: 'Demo',
        lastName: 'Admin',
        role: 'admin',
        isVerified: true,
        isActive: true
      });
      await adminUser.save();
      console.log('Created demo admin user');
    } else {
      adminUser = existingAdmin;
      console.log('Demo admin user already exists');
    }

    // Create demo project
    const existingProject = await Project.findOne({ apiKey: 'ak_demo12345' });
    
    if (!existingProject) {
      const demoProject = new Project({
        name: 'Demo Project',
        description: 'Demo project for testing authentication system',
        apiKey: 'ak_demo12345',
        apiSecret: generateApiSecret(),
        allowedDomains: ['localhost', '127.0.0.1'],
        allowedOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        settings: {
          allowSignup: true,
          requireEmailVerification: false, // Disabled for demo
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
        owner: adminUser._id,
        createdBy: adminUser._id,
        isActive: true
      });
      
      await demoProject.save();
      
      // Update admin user to have access to this project
      adminUser.projectAccess.push({
        projectId: demoProject._id,
        role: 'owner',
        joinedAt: new Date()
      });
      await adminUser.save();
      
      console.log('Created demo project with API key: ak_demo12345');
    } else {
      console.log('Demo project already exists');
    }

    console.log('\n✅ Demo data seeded successfully!');
    console.log('\nDemo credentials:');
    console.log('📧 Email: admin@demo.com');
    console.log('🔑 Password: admin123');
    console.log('🔗 API Key: ak_demo12345');
    console.log('\nYou can now register new users and login!');
    
  } catch (error) {
    console.error('Error seeding demo data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed script
seedDemoData();