import { Router } from 'express';

import { validate } from '@/shared/http/middleware/index';
import { getHealthController } from '@/modules/health/controller/health.controller';
import { HEALTH_ENDPOINTS, HealthQuerySchema } from '@srms/api-contracts';

const healthRoutes = Router();

healthRoutes.get(
  HEALTH_ENDPOINTS.HEALTH,
  validate({ query: HealthQuerySchema }),
  getHealthController,
);

export default healthRoutes;
