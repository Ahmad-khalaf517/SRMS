import express from 'express';
import dotenv from 'dotenv';
import healthRoutes from '@/modules/health/routes/health.routes';
import { errorHandler, requestLogger, notFoundHandler } from '@/shared/http/middleware/index';

dotenv.config();
const API_VERSION = process.env.API_VERSION ?? '1';
const BASE_URL = `/api/v${API_VERSION}`;

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

// Register routes
app.use(BASE_URL, healthRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
export { BASE_URL };
