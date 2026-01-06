const mongoose = require('mongoose');

// Disable buffering to avoid timeout issues in serverless
mongoose.set('bufferCommands', false);

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI environment variable is not defined');
      throw new Error('MONGO_URI is not defined');
    }
    
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
    });
    
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
    return db;
  }
  catch(error){
    console.error('MongoDB connection failed:', error.message);
    isConnected = false;
    throw error;
  }
};

module.exports = connectDB;