import { Router } from 'express';

import {
  createKitchenSectionController,
  deleteKitchenSectionController,
  listKitchenSectionsController,
  updateKitchenSectionController,
} from '@/modules/kitchen-section/controller/kitchen-section.controller';
import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import { validate } from '@/shared/http/middleware';
import {
  CreateKitchenSectionSchema,
  UpdateKitchenSectionSchema,
  KitchenSectionQuerySchema,
} from '@srms/api-contracts/kitchen-section';
import { USER_ROLE } from '@srms/api-contracts/user';

const kitchenSectionRoutes = Router();

kitchenSectionRoutes.get(
  '/kitchen-section',
  authenticate,
  validate({ query: KitchenSectionQuerySchema }),
  listKitchenSectionsController,
);

kitchenSectionRoutes.post(
  '/kitchen-section',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: CreateKitchenSectionSchema }),
  createKitchenSectionController,
);

kitchenSectionRoutes.patch(
  '/kitchen-section/:id',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: UpdateKitchenSectionSchema }),
  updateKitchenSectionController,
);

kitchenSectionRoutes.delete(
  '/kitchen-section/:id',
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  deleteKitchenSectionController,
);

export default kitchenSectionRoutes;
