import { type RequestHandler } from 'express';
import { toIsoTimestamp } from '@srms/utils';

import { sendSuccess } from '@/shared/http/response';
import { HealthResponse } from '@srms/api-contracts';

export const getHealthController: RequestHandler = (_req, res) => {
  const health: HealthResponse = {
    status: 'ok',
    service: 'api',
    timestamp: toIsoTimestamp(),
    uptimeSeconds: Math.floor(process.uptime()),
  };

  sendSuccess(res, health, 'Health check success');
};
