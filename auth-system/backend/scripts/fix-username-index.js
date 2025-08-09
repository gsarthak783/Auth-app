/**
 * Script to fix the username index issue
 * Run this if you continue to have problems with duplicate username: null errors
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function fixUsernameIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('projectUsers'); // Fixed: capital U in projectUsers

    // List current indexes
    console.log('\n📋 Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Find the problematic index
    const usernameIndex = indexes.find(idx => 
      idx.key.projectId === 1 && idx.key.username === 1
    );

    if (usernameIndex) {
      console.log('\n🔧 Dropping existing username index...');
      await collection.dropIndex(usernameIndex.name);
      console.log('✅ Index dropped');
    }

    // Create new sparse index
    console.log('\n🔨 Creating new sparse index...');
    await collection.createIndex(
      { projectId: 1, username: 1 },
      { 
        unique: true, 
        sparse: true,
        name: 'projectId_1_username_1_sparse'
      }
    );
    console.log('✅ Sparse index created successfully');

    // Optional: Remove all null usernames from existing documents
    console.log('\n🧹 Cleaning up null usernames...');
    const result = await collection.updateMany(
      { username: null },
      { $unset: { username: 1 } }
    );
    console.log(`✅ Removed username field from ${result.modifiedCount} documents`);

    console.log('\n✨ Fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixUsernameIndex(); 