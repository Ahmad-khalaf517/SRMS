import { type ErrorRequestHandler } from 'express';

import { AppError } from '@/shared/errors/app-error';
import logger from '@/shared/logging/logger';
import { sendError } from '@/shared/http/response';

const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    logger.warn(
      {
        path: req.originalUrl,
        method: req.method,
        code: err.code,
        details: err.details,
      },
      err.message,
    );

    sendError(res, err.message, err.details ?? [], err.statusCode);
    return;
  }

  logger.error(
    {
      err,
      path: req.originalUrl,
      method: req.method,
    },
    'Unhandled error',
  );

  sendError(res, 'Internal server error');
};

export default errorHandler;
