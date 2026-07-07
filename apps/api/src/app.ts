import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthRoutes from '@/modules/health/routes/health.routes';
import authRoutes from '@/modules/auth/routes/auth.routes';
import { errorHandler, requestLogger, notFoundHandler } from '@/shared/http/middleware/index';

dotenv.config();
const API_VERSION = process.env.API_VERSION ?? '1';
const BASE_URL = `/api/v${API_VERSION}`;
const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? 'http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

// Built-in middleware
app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestLogger);

// Register routes
app.use(BASE_URL, healthRoutes);
app.use(BASE_URL, authRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
export { BASE_URL };
