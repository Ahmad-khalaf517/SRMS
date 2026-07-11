import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthRoutes from '@/modules/health/routes/health.routes';
import authRoutes from '@/modules/auth/routes/auth.routes';
import categoryRoutes from '@/modules/categories/routes/category.routes';
import menuItemRoutes from '@/modules/menu-item/routes/menu-item.routes';
import ordersRoutes from '@/modules/orders/routes/orders.routes';
import userRoutes from '@/modules/user/routes/user.routes';
import { errorHandler, requestLogger, notFoundHandler } from '@/shared/http/middleware/index';
import { env } from '@/config/env';
import kitchenSectionRoutes from '@/modules/kitchen-section/routes/kitchen-section.routes';

const API_VERSION = env.API_VERSION ?? '1';
const BASE_URL = `/api/v${API_VERSION}`;
const CORS_ORIGINS = env.CORS_ORIGINS.split(',')
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
app.use(BASE_URL, categoryRoutes);
app.use(BASE_URL, kitchenSectionRoutes);
app.use(BASE_URL, menuItemRoutes);
app.use(BASE_URL, ordersRoutes);
app.use(BASE_URL, userRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
export { BASE_URL };
