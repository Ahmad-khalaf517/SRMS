import { Router } from 'express';

import {
  createMenuItemController,
  deleteMenuItemController,
  getMenuItemController,
  listMenuItemsController,
  toggleMenuItemAvailabilityController,
  updateMenuItemController,
} from '@/modules/menu-item/controller/menu-item.controller';
import { authenticate, authorize } from '@/modules/auth/utils/auth.middleware';
import { validate } from '@/shared/http/middleware';
import {
  CreateMenuItemSchema,
  MenuItemFiltersSchema,
  MenuItemIdParamsSchema,
  MENU_ITEM_ENDPOINTS,
  ToggleMenuItemAvailabilitySchema,
  UpdateMenuItemSchema,
} from '@srms/api-contracts/menu-item';
import { USER_ROLE } from '@srms/api-contracts/user';

const menuItemRoutes = Router();

menuItemRoutes.get(
  MENU_ITEM_ENDPOINTS.BASE,
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ query: MenuItemFiltersSchema }),
  listMenuItemsController,
);

menuItemRoutes.get(
  MENU_ITEM_ENDPOINTS.BY_ID(':id'),
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ params: MenuItemIdParamsSchema }),
  getMenuItemController,
);

menuItemRoutes.post(
  MENU_ITEM_ENDPOINTS.BASE,
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ body: CreateMenuItemSchema }),
  createMenuItemController,
);

menuItemRoutes.patch(
  MENU_ITEM_ENDPOINTS.BY_ID(':id'),
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ params: MenuItemIdParamsSchema, body: UpdateMenuItemSchema }),
  updateMenuItemController,
);

menuItemRoutes.patch(
  MENU_ITEM_ENDPOINTS.TOGGLE_AVAILABILITY(':id'),
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ params: MenuItemIdParamsSchema, body: ToggleMenuItemAvailabilitySchema }),
  toggleMenuItemAvailabilityController,
);

menuItemRoutes.delete(
  MENU_ITEM_ENDPOINTS.BY_ID(':id'),
  authenticate,
  authorize([USER_ROLE.ADMIN]),
  validate({ params: MenuItemIdParamsSchema }),
  deleteMenuItemController,
);

export default menuItemRoutes;
