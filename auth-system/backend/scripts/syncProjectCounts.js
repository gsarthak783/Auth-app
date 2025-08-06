import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import dotenv from 'dotenv';

dotenv.config();

const syncProjectCounts = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Syncing user project counts...');
    
    // Get all users
    const users = await User.find({});
    
    for (const user of users) {
      // Count actual projects owned by this user (not deleted)
      const actualProjectCount = await Project.countDocuments({
        owner: user._id,
        deletedAt: { $exists: false }
      });
      
      // Update user's totalProjects if it doesn't match
      if (user.stats?.totalProjects !== actualProjectCount) {
        console.log(`📊 User ${user.email}: ${user.stats?.totalProjects || 0} → ${actualProjectCount}`);
        
        await User.findByIdAndUpdate(user._id, {
          $set: { 'stats.totalProjects': actualProjectCount }
        });
      }
    }

    console.log('✅ Project counts synchronized successfully');
    
    // Show summary
    const summary = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalProjects: { $sum: '$stats.totalProjects' }
        }
      }
    ]);
    
    console.log('\n📈 Summary:');
    if (summary.length > 0) {
      console.log(`Total users: ${summary[0].totalUsers}`);
      console.log(`Total projects: ${summary[0].totalProjects}`);
    }

    await mongoose.disconnect();
    console.log('✅ Script completed successfully');
    
  } catch (error) {
    console.error('❌ Error syncing project counts:', error);
    process.exit(1);
  }
};

syncProjectCounts(); 