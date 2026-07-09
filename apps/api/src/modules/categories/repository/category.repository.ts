import { type CreateCategoryDTO, type UpdateCategoryDTO } from '@srms/api-contracts';
import { model, Schema, type InferSchemaType, type Types } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  },
  { timestamps: true },
);

categorySchema.index({ restaurantId: 1 });
categorySchema.index({ restaurantId: 1, createdAt: -1 });
categorySchema.index({ name: 1, restaurantId: 1 }, { unique: true });

export type CategoryDocument = InferSchemaType<typeof categorySchema> & { _id: Types.ObjectId };

const CategoryModel = model<CategoryDocument>('Category', categorySchema);

type PaginatedResult = {
  docs: CategoryDocument[];
  total: number;
};

export const findCategoriesByRestaurant = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<PaginatedResult> => {
  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    CategoryModel.find({ restaurantId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    CategoryModel.countDocuments({ restaurantId }),
  ]);
  return { docs: docs as CategoryDocument[], total };
};

export const findCategoryById = async (
  id: string,
  restaurantId: string,
): Promise<CategoryDocument | null> => {
  return CategoryModel.findOne({
    _id: id,
    restaurantId,
  }).lean() as Promise<CategoryDocument | null>;
};

export const findCategoryByName = async (
  name: string,
  restaurantId: string,
  excludeId?: string,
): Promise<CategoryDocument | null> => {
  const query: Record<string, unknown> = { name, restaurantId };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return CategoryModel.findOne(query).lean() as Promise<CategoryDocument | null>;
};

export const createCategory = async (
  payload: CreateCategoryDTO & { restaurantId: string },
): Promise<CategoryDocument> => {
  const doc = await CategoryModel.create(payload);
  return doc.toObject() as CategoryDocument;
};

export const updateCategoryById = async (
  id: string,
  restaurantId: string,
  payload: UpdateCategoryDTO,
): Promise<CategoryDocument | null> => {
  return CategoryModel.findOneAndUpdate(
    { _id: id, restaurantId },
    { $set: payload },
    { new: true },
  ).lean() as Promise<CategoryDocument | null>;
};

export const deleteCategoryById = async (
  id: string,
  restaurantId: string,
): Promise<CategoryDocument | null> => {
  return CategoryModel.findOneAndDelete({
    _id: id,
    restaurantId,
  }).lean() as Promise<CategoryDocument | null>;
};
