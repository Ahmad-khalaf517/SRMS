import {
  ORDER_STATUS,
  type CreateOrderDTO,
  type OrderFiltersQuery,
  type OrderMetrics,
  type TopSellingItem,
  type UpdateOrderStatusDTO,
} from '@srms/api-contracts/orders';
import { model, Schema, Types, type InferSchemaType } from 'mongoose';

const orderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.PREPARING,
        ORDER_STATUS.READY,
        ORDER_STATUS.COMPLETED,
      ],
      default: ORDER_STATUS.PENDING,
      required: true,
    },
    subtotal: { type: Number, required: true, default: 0 },
    tax: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, default: 0 },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

orderSchema.index({ restaurantId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, orderNumber: 1 }, { unique: true });
orderSchema.index({ restaurantId: 1, status: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, createdBy: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, completedAt: -1 });

const orderItemSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    notes: { type: String, trim: true },
    status: { type: String, trim: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  },
  { timestamps: true },
);

orderItemSchema.index({ orderId: 1 });
orderItemSchema.index({ restaurantId: 1, menuItemId: 1, createdAt: -1 });

export type OrderDocument = InferSchemaType<typeof orderSchema> & { _id: Types.ObjectId };
export type OrderItemDocument = InferSchemaType<typeof orderItemSchema> & { _id: Types.ObjectId };

const OrderModel = model<OrderDocument>('Order', orderSchema, 'orders');
const OrderItemModel = model<OrderItemDocument>('OrderItem', orderItemSchema, 'order_items');

type PaginatedOrders = {
  docs: OrderDocument[];
  total: number;
};

const buildOrderQuery = (
  restaurantId: string,
  filters: Partial<OrderFiltersQuery>,
  createdBy?: string,
): Record<string, unknown> => {
  const query: Record<string, unknown> = { restaurantId };

  if (createdBy) {
    query.createdBy = createdBy;
  }

  if (filters.search) {
    query.orderNumber = { $regex: filters.search.trim(), $options: 'i' };
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.createdBy) {
    query.createdBy = filters.createdBy;
  }

  if (filters.from || filters.to) {
    query.createdAt = {
      ...(filters.from ? { $gte: new Date(filters.from) } : {}),
      ...(filters.to ? { $lte: new Date(filters.to) } : {}),
    };
  }

  return query;
};

const buildDateMatch = (from?: string, to?: string): Record<string, unknown> | undefined => {
  if (!from && !to) {
    return undefined;
  }

  return {
    ...(from ? { $gte: new Date(from) } : {}),
    ...(to ? { $lte: new Date(to) } : {}),
  };
};

export const createOrder = async (
  restaurantId: string,
  createdBy: string,
  orderNumber: string,
  payload: CreateOrderDTO,
  totals: { subtotal: number; tax: number; total: number },
  menuItemPrices: Record<string, number>,
): Promise<{ order: OrderDocument; items: OrderItemDocument[] }> => {
  const order = await OrderModel.create({
    orderNumber,
    status: ORDER_STATUS.PENDING,
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    restaurantId,
    createdBy,
  });

  const orderItems = await OrderItemModel.insertMany(
    payload.items.map((item) => ({
      orderId: order._id,
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      price: menuItemPrices[item.menuItemId] ?? 0,
      notes: item.notes,
      restaurantId,
    })),
  );

  return {
    order: order.toObject() as OrderDocument,
    items: orderItems.map((item) => item.toObject() as OrderItemDocument),
  };
};

export const findOrders = async (
  restaurantId: string,
  filters: Partial<OrderFiltersQuery>,
): Promise<PaginatedOrders> => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const skip = (page - 1) * limit;
  const query = buildOrderQuery(restaurantId, filters);

  const [docs, total] = await Promise.all([
    OrderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    OrderModel.countDocuments(query),
  ]);

  return { docs: docs as OrderDocument[], total };
};

export const findMyOrders = async (
  restaurantId: string,
  createdBy: string,
  filters: Partial<OrderFiltersQuery>,
): Promise<PaginatedOrders> => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const skip = (page - 1) * limit;
  const query = buildOrderQuery(restaurantId, filters, createdBy);

  const [docs, total] = await Promise.all([
    OrderModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    OrderModel.countDocuments(query),
  ]);

  return { docs: docs as OrderDocument[], total };
};

export const findOrderById = async (
  id: string,
  restaurantId: string,
): Promise<{ order: OrderDocument; items: OrderItemDocument[] } | null> => {
  const order = (await OrderModel.findOne({
    _id: id,
    restaurantId,
  }).lean()) as OrderDocument | null;
  if (!order) {
    return null;
  }

  const items = (await OrderItemModel.find({ orderId: id }).lean()) as OrderItemDocument[];
  return { order, items };
};

export const updateOrderStatusById = async (
  id: string,
  restaurantId: string,
  payload: UpdateOrderStatusDTO,
): Promise<OrderDocument | null> => {
  return (await OrderModel.findOneAndUpdate(
    { _id: id, restaurantId },
    {
      $set: {
        status: payload.status,
        ...(payload.status === ORDER_STATUS.COMPLETED ? { completedAt: new Date() } : {}),
      },
    },
    { new: true },
  ).lean()) as OrderDocument | null;
};

export const getOrderMetrics = async (
  restaurantId: string,
  from?: string,
  to?: string,
): Promise<OrderMetrics> => {
  const match: Record<string, unknown> = {
    restaurantId: new Types.ObjectId(restaurantId),
  };
  const dateMatch = buildDateMatch(from, to);
  if (dateMatch) {
    match.createdAt = dateMatch;
  }

  const result = await OrderModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: {
          $sum: {
            $cond: [{ $eq: ['$status', ORDER_STATUS.COMPLETED] }, '$total', 0],
          },
        },
        pendingOrders: {
          $sum: {
            $cond: [{ $in: ['$status', [ORDER_STATUS.PENDING, ORDER_STATUS.PREPARING]] }, 1, 0],
          },
        },
      },
    },
  ]);

  return {
    totalRevenue: result[0]?.totalRevenue ?? 0,
    totalOrders: result[0]?.totalOrders ?? 0,
    pendingOrders: result[0]?.pendingOrders ?? 0,
  };
};

export const getTopSellingItems = async (
  restaurantId: string,
  from?: string,
  to?: string,
  limit = 10,
): Promise<TopSellingItem[]> => {
  const match: Record<string, unknown> = {
    restaurantId: new Types.ObjectId(restaurantId),
  };
  const dateMatch = buildDateMatch(from, to);
  if (dateMatch) {
    match.createdAt = dateMatch;
  }

  const result = await OrderItemModel.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$menuItemId',
        quantitySold: { $sum: '$quantity' },
        revenueContribution: { $sum: { $multiply: ['$quantity', '$price'] } },
      },
    },
    { $sort: { quantitySold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'menu_items',
        localField: '_id',
        foreignField: '_id',
        as: 'menuItem',
      },
    },
    {
      $project: {
        menuItemId: { $toString: '$_id' },
        name: {
          $ifNull: [{ $arrayElemAt: ['$menuItem.name', 0] }, 'Unknown item'],
        },
        quantitySold: 1,
        revenueContribution: 1,
      },
    },
  ]);

  return result as TopSellingItem[];
};
