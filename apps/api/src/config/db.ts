import mongoose from 'mongoose';
import logger from '@/shared/logging/logger';

const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);
    logger.info('MongoDB connected');
    return db;
  } catch (error) {
    logger.error({ error }, 'MongoDB connection failed');
    process.exit(1);
  }
};

export default connectDB;
