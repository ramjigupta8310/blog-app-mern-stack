import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME,
    });
    console.log('MongoDB Connected Successfully...!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};

export default connectDB;
