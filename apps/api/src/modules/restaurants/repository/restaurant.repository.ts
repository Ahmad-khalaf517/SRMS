import { CreateRestaurantDTO, UpdateRestaurantDTO } from '@srms/api-contracts';
import { ClientSession, model, Schema, type InferSchemaType, type Types } from 'mongoose';

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    isActive: { type: Boolean, default: true },
    logo: { type: String, trim: true },
  },
  { timestamps: true },
);

export type RestaurantDocument = InferSchemaType<typeof restaurantSchema> & { _id: Types.ObjectId };

const RestaurantModel = model<RestaurantDocument>('Restaurant', restaurantSchema);

export const createRestaurant = async (
  payload: CreateRestaurantDTO,
  session?: ClientSession,
): Promise<RestaurantDocument> => {
  const [restaurant] = await RestaurantModel.create([payload], { session });
  return restaurant;
};

export const findRestaurantById = async (id: string): Promise<RestaurantDocument | null> => {
  return RestaurantModel.findById(id).lean() as Promise<RestaurantDocument | null>;
};

export const findRestaurantByName = async (
  name: string,
  excludeId?: string,
): Promise<RestaurantDocument | null> => {
  const query: Record<string, unknown> = { name };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return RestaurantModel.findOne(query).lean() as Promise<RestaurantDocument | null>;
};

export const updateRestaurantById = async (
  id: string,
  payload: UpdateRestaurantDTO,
): Promise<RestaurantDocument | null> => {
  return RestaurantModel.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true },
  ).lean() as Promise<RestaurantDocument | null>;
};
