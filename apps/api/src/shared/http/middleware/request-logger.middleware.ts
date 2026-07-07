import { type RequestHandler } from 'express';

import logger from '@/shared/logging/logger';

const requestLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const elapsedMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    const payload = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      elapsedMs: Number(elapsedMs.toFixed(2)),
    };

    if (res.statusCode >= 500) {
      logger.error(payload, 'Request completed with server error');
      return;
    }

    if (res.statusCode >= 400) {
      logger.warn(payload, 'Request completed with client error');
      return;
    }

    logger.info(payload, 'Request completed');
  });

  next();
};

export default requestLogger;
