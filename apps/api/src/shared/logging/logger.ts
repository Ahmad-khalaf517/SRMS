import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: {
    paths: ['req.headers.authorization', 'password', 'token', 'refreshToken'],
    censor: '[REDACTED]',
  },
});

export default logger;
