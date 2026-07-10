import {
  ORDER_STATUS,
  type CreateOrderDTO,
  type Order,
  type OrderFiltersQuery,
  type OrderList,
  type OrderMetrics,
  type TopSellingItem,
  type UpdateOrderStatusDTO,
} from '@srms/api-contracts/orders';

import {
  createOrder,
  findMyOrders,
  findOrderById,
  findOrders,
  getOrderMetrics,
  getTopSellingItems,
  updateOrderStatusById,
  type OrderDocument,
  type OrderItemDocument,
} from '@/modules/orders/repository/orders.repository';
import { findMenuItemById } from '@/modules/menu-item/repository/menu-item.repository';
import { AppError, ConflictError, NotFoundError, ValidationError } from '@/shared/errors/app-error';

const ORDER_TRANSITIONS: Record<string, string[]> = {
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.PREPARING],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY],
  [ORDER_STATUS.READY]: [ORDER_STATUS.COMPLETED],
  [ORDER_STATUS.COMPLETED]: [],
};

const toOrderDTO = (doc: OrderDocument, items: OrderItemDocument[] = []): Order => ({
  id: doc._id.toString(),
  orderNumber: doc.orderNumber as string,
  status: doc.status as (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS],
  subtotal: doc.subtotal as number,
  tax: doc.tax as number,
  total: doc.total as number,
  restaurantId: doc.restaurantId.toString(),
  createdBy: doc.createdBy.toString(),
  completedAt: doc.completedAt ? (doc.completedAt as Date).toISOString() : undefined,
  createdAt: (doc.createdAt as Date).toISOString(),
  updatedAt: (doc.updatedAt as Date).toISOString(),
  items: items.map((item) => ({
    id: item._id.toString(),
    orderId: item.orderId.toString(),
    menuItemId: item.menuItemId.toString(),
    quantity: item.quantity as number,
    price: item.price as number,
    notes: item.notes as string | undefined,
    status: item.status as string | undefined,
    createdAt: (item.createdAt as Date).toISOString(),
    updatedAt: (item.updatedAt as Date).toISOString(),
  })),
});

const TAX_RATE = 0.1;

const createOrderNumber = (): string => {
  const stamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, '0');
  return `ORD-${stamp}-${random}`;
};

const computeTotals = (items: Array<{ quantity: number; price: number }>) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));
  return { subtotal: Number(subtotal.toFixed(2)), tax, total };
};

const assertValidTransition = (currentStatus: string, nextStatus: string) => {
  const allowed = ORDER_TRANSITIONS[currentStatus] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw new ValidationError(
      `Invalid order status transition from ${currentStatus} to ${nextStatus}`,
    );
  }
};

const mapOrderServiceError = (error: unknown): never => {
  if (error instanceof AppError) {
    throw error;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: number }).code === 11000
  ) {
    throw new ConflictError('Order number conflict. Please retry.');
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    (error as { name?: string }).name === 'CastError'
  ) {
    throw new ValidationError('Invalid identifier provided.');
  }

  throw error;
};

export const createOrderService = async (
  restaurantId: string,
  createdBy: string,
  dto: CreateOrderDTO,
): Promise<Order> => {
  try {
    if (!dto.items.length) {
      throw new ValidationError('Order must include at least one item');
    }

    const menuItemPrices: Record<string, number> = {};

    for (const item of dto.items) {
      const menuItem = await findMenuItemById(item.menuItemId, restaurantId);
      if (!menuItem) {
        throw new NotFoundError('Menu item not found');
      }
      menuItemPrices[item.menuItemId] = menuItem.price as number;
    }

    const totals = computeTotals(
      dto.items.map((item) => ({
        quantity: item.quantity,
        price: menuItemPrices[item.menuItemId],
      })),
    );

    const created = await createOrder(
      restaurantId,
      createdBy,
      createOrderNumber(),
      dto,
      totals,
      menuItemPrices,
    );

    return toOrderDTO(created.order, created.items);
  } catch (error) {
    return mapOrderServiceError(error);
  }
};

export const listOrdersService = async (
  restaurantId: string,
  filters: Partial<OrderFiltersQuery>,
): Promise<OrderList> => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const { docs, total } = await findOrders(restaurantId, filters);

  return {
    data: docs.map((doc) => toOrderDTO(doc)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const listMyOrdersService = async (
  restaurantId: string,
  userId: string,
  filters: Partial<OrderFiltersQuery>,
): Promise<OrderList> => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const { docs, total } = await findMyOrders(restaurantId, userId, filters);

  return {
    data: docs.map((doc) => toOrderDTO(doc)),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOrderByIdService = async (restaurantId: string, id: string): Promise<Order> => {
  try {
    const found = await findOrderById(id, restaurantId);
    if (!found) {
      throw new NotFoundError('Order not found');
    }

    return toOrderDTO(found.order, found.items);
  } catch (error) {
    return mapOrderServiceError(error);
  }
};

export const updateOrderStatusService = async (
  restaurantId: string,
  id: string,
  dto: UpdateOrderStatusDTO,
): Promise<Order> => {
  try {
    const found = await findOrderById(id, restaurantId);
    if (!found) {
      throw new NotFoundError('Order not found');
    }

    assertValidTransition(found.order.status as string, dto.status);

    const updated = await updateOrderStatusById(id, restaurantId, dto);
    if (!updated) {
      throw new NotFoundError('Order not found');
    }

    return toOrderDTO(updated);
  } catch (error) {
    return mapOrderServiceError(error);
  }
};

export const getOrderMetricsService = async (
  restaurantId: string,
  from?: string,
  to?: string,
): Promise<OrderMetrics> => {
  return getOrderMetrics(restaurantId, from, to);
};

export const getTopSellingItemsService = async (
  restaurantId: string,
  from?: string,
  to?: string,
  limit?: number,
): Promise<TopSellingItem[]> => {
  return getTopSellingItems(restaurantId, from, to, limit ?? 10);
};
