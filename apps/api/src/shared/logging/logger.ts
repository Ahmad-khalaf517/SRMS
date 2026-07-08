import { env } from '@/config/env';
import pino from 'pino';

// Check if we are running in development mode
const isDevelopment = env.NODE_ENV === 'development';

console.log('is development:', isDevelopment, env.NODE_ENV);

const logger = pino({
  level: env.LOG_LEVEL ?? 'info',

  // Use pino-pretty only in development for better readability
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true, // Adds color-coding to log levels
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l', // Human-readable timestamps
          ignore: 'pid,hostname', // Hides clutter you rarely need locally
          singleLine: false, // Set to true if you prefer compact, single-line logs
        },
      }
    : undefined,

  redact: {
    paths: ['req.headers.authorization', 'password', 'token', 'refreshToken'],
    censor: '[REDACTED]',
  },
});

export default logger;
