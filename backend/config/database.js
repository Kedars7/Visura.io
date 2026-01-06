const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI environment variable is not defined');
      throw new Error('MONGO_URI is not defined');
    }
    
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB connected successfully');
  }
  catch(error){
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;