import mongoose from 'mongoose';
import logger from '@/shared/logging/logger';

const connectDB = async (): Promise<typeof mongoose> => {
  const mongoUri = process.env.MONGODB_URI ?? process.env.MONGO_URI;

  if (!mongoUri) {
    logger.error('MongoDB connection failed: missing MONGODB_URI or MONGO_URI');
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
