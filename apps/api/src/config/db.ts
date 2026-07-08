import mongoose from 'mongoose';
import logger from '@/shared/logging/logger';
import { env } from '@/config/env';

const connectDB = async (): Promise<typeof mongoose> => {
  const mongoUri = env.MONGODB_URI;

  if (!mongoUri) {
    logger.error('MongoDB connection failed: missing MONGODB_URI');
    process.exit(1);
  }

  try {
    const db = await mongoose.connect(mongoUri);
    logger.info('MongoDB connected');
    return db;
  } catch (error) {
    logger.error({ err: error }, 'MongoDB connection failed');
    process.exit(1);
  }
};

export default connectDB;
