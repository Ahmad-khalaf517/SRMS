import { server, BASE_URL } from '@/server';
import connectDB from '@/config/db';
import logger from '@/shared/logging/logger';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 3000;

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error({ port: PORT }, 'Port is already in use');
    process.exit(1);
  }

  logger.error({ error }, 'Server startup failed');
  process.exit(1);
});

const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    const address = server.address();
    const host =
      address && typeof address === 'object'
        ? address.address === '::'
          ? 'localhost'
          : address.address
        : 'localhost';
    const port = address && typeof address === 'object' ? address.port : PORT;
    const url = `http://${host}:${port}${BASE_URL}`;
    logger.info({ url }, 'Server started');
  });
};

const shutdown = async () => {
  try {
    await mongoose.connection.close();
  } catch (error) {
    logger.error({ error }, 'Failed to close MongoDB connection');
  }

  server.close(() => {
    process.exit(0);
  });
};

void startServer();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
