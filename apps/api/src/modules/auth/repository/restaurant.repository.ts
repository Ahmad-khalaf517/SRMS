import { ClientSession, model, Schema, type InferSchemaType, type Types } from 'mongoose';

const restaurantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type RestaurantDocument = InferSchemaType<typeof restaurantSchema> & { _id: Types.ObjectId };

const RestaurantModel = model<RestaurantDocument>('Restaurant', restaurantSchema);

type CreateRestaurantInput = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

export const createRestaurant = async (
  payload: CreateRestaurantInput,
  session?: ClientSession,
): Promise<RestaurantDocument> => {
  const [restaurant] = await RestaurantModel.create([payload], { session });
  return restaurant;
};
