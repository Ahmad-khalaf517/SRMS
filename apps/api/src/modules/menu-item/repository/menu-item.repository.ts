import {
  type CreateMenuItemDTO,
  type MenuItemFiltersQuery,
  type UpdateMenuItemDTO,
} from '@srms/api-contracts';
import { model, Schema, type InferSchemaType, type Types } from 'mongoose';

const menuItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    kitchenSectionId: { type: Schema.Types.ObjectId, ref: 'KitchenSection', required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true },
);

menuItemSchema.index({ restaurantId: 1, createdAt: -1 });
menuItemSchema.index({ restaurantId: 1, name: 1 });
menuItemSchema.index({ restaurantId: 1, categoryId: 1 });
menuItemSchema.index({ restaurantId: 1, kitchenSectionId: 1 });
menuItemSchema.index({ restaurantId: 1, isAvailable: 1 });

export type MenuItemDocument = InferSchemaType<typeof menuItemSchema> & { _id: Types.ObjectId };

const MenuItemModel = model<MenuItemDocument>('MenuItem', menuItemSchema, 'menu_items');

type PaginatedResult = {
  docs: MenuItemDocument[];
  total: number;
};

const buildListQuery = (restaurantId: string, filters: Partial<MenuItemFiltersQuery>) => {
  const query: Record<string, unknown> = { restaurantId };

  if (filters.search) {
    query.name = { $regex: filters.search.trim(), $options: 'i' };
  }

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  if (filters.kitchenSectionId) {
    query.kitchenSectionId = filters.kitchenSectionId;
  }

  if (filters.isAvailable !== undefined) {
    query.isAvailable = filters.isAvailable;
  }

  return query;
};

export const findMenuItemsByRestaurant = async (
  restaurantId: string,
  filters: Partial<MenuItemFiltersQuery>,
): Promise<PaginatedResult> => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 10;
  const skip = (page - 1) * limit;
  const query = buildListQuery(restaurantId, filters);

  const [docs, total] = await Promise.all([
    MenuItemModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    MenuItemModel.countDocuments(query),
  ]);

  return { docs: docs as MenuItemDocument[], total };
};

export const findMenuItemById = async (
  id: string,
  restaurantId: string,
): Promise<MenuItemDocument | null> => {
  return MenuItemModel.findOne({
    _id: id,
    restaurantId,
  }).lean() as Promise<MenuItemDocument | null>;
};

export const createMenuItem = async (
  payload: CreateMenuItemDTO & { restaurantId: string },
): Promise<MenuItemDocument> => {
  const doc = await MenuItemModel.create(payload);
  return doc.toObject() as MenuItemDocument;
};

export const updateMenuItemById = async (
  id: string,
  restaurantId: string,
  payload: UpdateMenuItemDTO,
): Promise<MenuItemDocument | null> => {
  return MenuItemModel.findOneAndUpdate(
    { _id: id, restaurantId },
    { $set: payload },
    { new: true },
  ).lean() as Promise<MenuItemDocument | null>;
};

export const deleteMenuItemById = async (
  id: string,
  restaurantId: string,
): Promise<MenuItemDocument | null> => {
  return MenuItemModel.findOneAndDelete({
    _id: id,
    restaurantId,
  }).lean() as Promise<MenuItemDocument | null>;
};

export const toggleMenuItemAvailability = async (
  id: string,
  restaurantId: string,
  isAvailable: boolean,
): Promise<MenuItemDocument | null> => {
  return MenuItemModel.findOneAndUpdate(
    { _id: id, restaurantId },
    { $set: { isAvailable } },
    { new: true },
  ).lean() as Promise<MenuItemDocument | null>;
};
