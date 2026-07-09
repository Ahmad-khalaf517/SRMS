import { type CreateKitchenSectionDTO, type UpdateKitchenSectionDTO } from '@srms/api-contracts';
import { model, Schema, type InferSchemaType, type Types } from 'mongoose';

const kitchenSectionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  },
  { timestamps: true },
);

kitchenSectionSchema.index({ restaurantId: 1 });
kitchenSectionSchema.index({ restaurantId: 1, createdAt: -1 });
kitchenSectionSchema.index({ name: 1, restaurantId: 1 }, { unique: true });

export type KitchenSectionDocument = InferSchemaType<typeof kitchenSectionSchema> & {
  _id: Types.ObjectId;
};

const KitchenSectionModel = model<KitchenSectionDocument>('KitchenSection', kitchenSectionSchema);

type PaginatedResult = {
  docs: KitchenSectionDocument[];
  total: number;
};

export const findKitchenSectionsByRestaurant = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<PaginatedResult> => {
  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    KitchenSectionModel.find({ restaurantId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    KitchenSectionModel.countDocuments({ restaurantId }),
  ]);
  return { docs: docs as KitchenSectionDocument[], total };
};

export const findKitchenSectionById = async (
  id: string,
  restaurantId: string,
): Promise<KitchenSectionDocument | null> => {
  return KitchenSectionModel.findOne({
    _id: id,
    restaurantId,
  }).lean() as Promise<KitchenSectionDocument | null>;
};

export const findKitchenSectionByName = async (
  name: string,
  restaurantId: string,
  excludeId?: string,
): Promise<KitchenSectionDocument | null> => {
  const query: Record<string, unknown> = { name, restaurantId };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return KitchenSectionModel.findOne(query).lean() as Promise<KitchenSectionDocument | null>;
};

export const createKitchenSection = async (
  payload: CreateKitchenSectionDTO & { restaurantId: string },
): Promise<KitchenSectionDocument> => {
  const doc = await KitchenSectionModel.create(payload);
  return doc.toObject() as KitchenSectionDocument;
};

export const updateKitchenSectionById = async (
  id: string,
  restaurantId: string,
  payload: UpdateKitchenSectionDTO,
): Promise<KitchenSectionDocument | null> => {
  return KitchenSectionModel.findOneAndUpdate(
    { _id: id, restaurantId },
    { $set: payload },
    { new: true },
  ).lean() as Promise<KitchenSectionDocument | null>;
};

export const deleteKitchenSectionById = async (
  id: string,
  restaurantId: string,
): Promise<KitchenSectionDocument | null> => {
  return KitchenSectionModel.findOneAndDelete({
    _id: id,
    restaurantId,
  }).lean() as Promise<KitchenSectionDocument | null>;
};
