import mongoose from 'mongoose';
import { seed } from '../utils/seed.js';

let mongod = null;

export const connectDB = async () => {
  const configuredUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-career-copilot';

  try {
    // Attempt connecting to configured MongoDB with a short timeout
    const conn = await mongoose.connect(configuredUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    
    // Auto-seed if empty
    const User = (await import('../models/User.js')).default;
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('📦 Database is empty. Seeding initial data...');
      await seed(false);
    }
    return conn;
  } catch (err) {
    console.warn(`⚠️ Could not connect to local MongoDB (${err.message})`);
    console.log('🔄 Starting embedded In-Memory MongoDB server...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();

      const conn = await mongoose.connect(memUri);
      console.log(`✅ Embedded In-Memory MongoDB connected at ${memUri}`);

      // Seed initial data into memory database
      await seed(false);
      return conn;
    } catch (memErr) {
      console.error(`❌ Failed to start In-Memory MongoDB: ${memErr.message}`);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting database:', err);
  }
};

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});
