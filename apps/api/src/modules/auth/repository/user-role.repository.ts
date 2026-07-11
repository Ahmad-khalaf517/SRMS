import { CreateUserRoleDTO, USER_ROLE, type UserRole } from '@srms/api-contracts/user';
import { ClientSession, model, Schema, type InferSchemaType, type Types } from 'mongoose';

const userRoleSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    role: {
      type: String,
      required: true,
      enum: Object.values(USER_ROLE),
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

userRoleSchema.index({ userId: 1, restaurantId: 1, role: 1 }, { unique: true });
userRoleSchema.index({ restaurantId: 1, role: 1 });

export type UserRoleDocument = InferSchemaType<typeof userRoleSchema> & { _id: Types.ObjectId };

const UserRoleModel = model<UserRoleDocument>('UserRole', userRoleSchema, 'user_roles');

export const createUserRole = async (
  payload: CreateUserRoleDTO,
  session?: ClientSession,
): Promise<UserRoleDocument> => {
  const [userRole] = await UserRoleModel.create([payload], { session });
  return userRole;
};

export const findActiveRoleForUser = async (userId: string): Promise<UserRoleDocument | null> => {
  return UserRoleModel.findOne({ userId, isActive: true });
};

export const findActiveRoleForUserInRestaurant = async (
  userId: string,
  restaurantId: string,
): Promise<UserRoleDocument | null> => {
  return UserRoleModel.findOne({ userId, restaurantId, isActive: true });
};

export const findRoleForUserInRestaurant = async (
  userId: string,
  restaurantId: string,
): Promise<UserRoleDocument | null> => {
  return UserRoleModel.findOne({ userId, restaurantId });
};

export const findRolesByRestaurant = async (
  restaurantId: string,
  page: number,
  limit: number,
  excludeUserId?: string,
): Promise<{ docs: UserRoleDocument[]; total: number }> => {
  const skip = (page - 1) * limit;
  const filter: { restaurantId: string; userId?: { $ne: string } } = { restaurantId };
  if (excludeUserId) {
    filter.userId = { $ne: excludeUserId };
  }

  const [docs, total] = await Promise.all([
    UserRoleModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserRoleModel.countDocuments(filter),
  ]);

  return { docs, total };
};

export const countActiveAdminsByRestaurant = async (restaurantId: string): Promise<number> => {
  return UserRoleModel.countDocuments({
    restaurantId,
    role: USER_ROLE.ADMIN,
    isActive: true,
  });
};

export const updateRoleForUserInRestaurant = async (
  userId: string,
  restaurantId: string,
  role: UserRole,
): Promise<UserRoleDocument | null> => {
  return UserRoleModel.findOneAndUpdate(
    { userId, restaurantId },
    { $set: { role } },
    { new: true },
  );
};

export const updateRoleActiveForUserInRestaurant = async (
  userId: string,
  restaurantId: string,
  isActive: boolean,
): Promise<UserRoleDocument | null> => {
  return UserRoleModel.findOneAndUpdate(
    { userId, restaurantId },
    { $set: { isActive } },
    { new: true },
  );
};

export const deleteRolesForUserInRestaurant = async (
  userId: string,
  restaurantId: string,
): Promise<number> => {
  const result = await UserRoleModel.deleteMany({ userId, restaurantId });
  return result.deletedCount ?? 0;
};

export const countRolesForUser = async (userId: string): Promise<number> => {
  return UserRoleModel.countDocuments({ userId });
};
