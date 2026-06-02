import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.DB_URI);
    console.log('Database connected...');
  } catch (error) {
    console.error('Error connecting to Database:', error);
    process.exit(1);
  } 
};

export default connectDB;