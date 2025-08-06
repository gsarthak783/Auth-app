import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const fixNegativeProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const result = await User.updateMany(
      { 'stats.totalProjects': { $lt: 0 } },
      { $set: { 'stats.totalProjects': 0 } }
    );
    
    console.log(`Fixed ${result.modifiedCount} users with negative project counts`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

fixNegativeProjects(); 