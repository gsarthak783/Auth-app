import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const updateUserLimits = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Updating user limits...');
    
    // Update all users with new default limits
    const result = await User.updateMany(
      {}, // Update all users
      {
        $set: {
          'limits.maxProjects': 5,
          'limits.maxUsersPerProject': 10000,
          'limits.maxAPICallsPerMonth': 100000
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with new limits`);

    // Also ensure all users have proper stats structure
    const statsResult = await User.updateMany(
      { 'stats.totalProjects': { $exists: false } },
      {
        $set: {
          'stats.totalProjects': 0,
          'stats.totalAPICallsThisMonth': 0,
          'stats.lastAPICallsReset': new Date()
        }
      }
    );

    console.log(`✅ Updated ${statsResult.modifiedCount} users with proper stats structure`);

    // Show some sample users
    const sampleUsers = await User.find({}).limit(3).select('email limits stats');
    console.log('\n📊 Sample users after update:');
    sampleUsers.forEach(user => {
      console.log(`User: ${user.email}`);
      console.log(`  Limits: ${JSON.stringify(user.limits)}`);
      console.log(`  Stats: ${JSON.stringify(user.stats)}`);
      console.log('');
    });

    await mongoose.disconnect();
    console.log('✅ Script completed successfully');
    
  } catch (error) {
    console.error('❌ Error updating user limits:', error);
    process.exit(1);
  }
};

updateUserLimits(); 