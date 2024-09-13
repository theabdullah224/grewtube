import mongoose from 'mongoose';

let isConnected = false; 

export async function connect() {
  const mongoUrl = process.env.MONGO_URL || ''; 
  if (isConnected) {
    console.log('MongoDB is already connected.');
    return;
  }

  if (!mongoUrl) {
    throw new Error('MongoDB connection URL is missing in environment variables!');
  }

  try {
    await mongoose.connect(mongoUrl); 
    isConnected = true;
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to database');
  }
}
