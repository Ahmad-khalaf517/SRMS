import { CreateUserRoleDTO, USER_ROLE } from '@srms/api-contracts/user';
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
