import { Router } from 'express';
import { HealthQuerySchema } from '@srms/validation/health';

import { validate } from '@/shared/http/middleware/index';
import { getHealthController } from '@/modules/health/controller/health.controller';

const healthRoutes = Router();

healthRoutes.get('/health', validate({ query: HealthQuerySchema }), getHealthController);

export default healthRoutes;
