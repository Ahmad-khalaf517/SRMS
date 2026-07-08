import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT!,
  MONGODB_URI: process.env.MONGODB_URI!,
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS!, 10),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL!,
  JWT_REFRESH_TTL: process.env.JWT_REFRESH_TTL!,
  REFRESH_COOKIE_NAME: process.env.REFRESH_COOKIE_NAME!,
  API_VERSION: process.env.API_VERSION!,
  CORS_ORIGINS: process.env.CORS_ORIGINS!,
  LOG_LEVEL: process.env.LOG_LEVEL!,
  NODE_ENV: process.env.NODE_ENV!,
};
