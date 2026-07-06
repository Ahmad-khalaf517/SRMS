import express from "express";
import dotenv from "dotenv";
import errorHandler from "./middleware/error.middleware.js";
import logRequestHandler from "./middleware/log-requests.js";
import notFoundHandler from "./middleware/not-found.middleware.js";

dotenv.config();
const API_VERSION = process.env.API_VERSION;
const BASE_URL = `/api/v${API_VERSION}`;

const app = express();

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger (optional)
app.use(logRequestHandler);

// Register routes
// app.use(BASE_URL, routes);
app.use(BASE_URL, (req, res) => {
  res.json({ message: "Hello from Express!" });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
export { BASE_URL };