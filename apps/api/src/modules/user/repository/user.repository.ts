import { type CreateUserDTO, type UpdateUserDTO } from '@srms/api-contracts';
import { model, Schema, type InferSchemaType, type Types } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  },
  { timestamps: true },
);

UserSchema.index({ restaurantId: 1 });
UserSchema.index({ restaurantId: 1, createdAt: -1 });
UserSchema.index({ name: 1, restaurantId: 1 }, { unique: true });

export type UserDocument = InferSchemaType<typeof UserSchema> & { _id: Types.ObjectId };

const UserModel = model<UserDocument>('User', UserSchema);

type PaginatedResult = {
  docs: UserDocument[];
  total: number;
};

export const findUserByName = async (name: string, restaurantId: string) => {
  return UserModel.findOne({ name, restaurantId });
};

export const findUserByRestaurant = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<PaginatedResult> => {
  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    UserModel.find({ restaurantId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    UserModel.countDocuments({ restaurantId }),
  ]);
  return { docs: docs as UserDocument[], total };
};

export const findUserById = async (
  id: string,
  restaurantId: string,
): Promise<UserDocument | null> => {
  return UserModel.findOne({
    _id: id,
    restaurantId,
  }).lean() as Promise<UserDocument | null>;
};

export const createUser = async (
  payload: CreateUserDTO & { restaurantId: string },
): Promise<UserDocument> => {
  const doc = await UserModel.create(payload);
  return doc.toObject() as UserDocument;
};

export const updateUserById = async (
  id: string,
  restaurantId: string,
  payload: UpdateUserDTO,
): Promise<UserDocument | null> => {
  return UserModel.findOneAndUpdate(
    { _id: id, restaurantId },
    { $set: payload },
    { new: true },
  ).lean() as Promise<UserDocument | null>;
};

export const deleteUserById = async (
  id: string,
  restaurantId: string,
): Promise<UserDocument | null> => {
  return UserModel.findOneAndDelete({
    _id: id,
    restaurantId,
  }).lean() as Promise<UserDocument | null>;
};
