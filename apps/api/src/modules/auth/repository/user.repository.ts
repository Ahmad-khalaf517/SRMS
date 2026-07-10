import { CreateUserDTO } from '@srms/api-contracts';
import { ClientSession, model, Schema, type InferSchemaType, type Types } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };

const UserModel = model<UserDocument>('User', userSchema);

export const findUserByEmail = async (email: string): Promise<UserDocument | null> => {
  return UserModel.findOne({ email: email.toLowerCase() });
};

export const findUserById = async (id: string): Promise<UserDocument | null> => {
  return UserModel.findById(id);
};

export const findUsersByIds = async (
  ids: string[],
): Promise<Array<{ id: string; name: string }>> => {
  if (!ids.length) {
    return [];
  }

  const users = await UserModel.find({ _id: { $in: ids } })
    .select({ name: 1 })
    .lean();

  return users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
  }));
};

export const createUser = async (
  payload: CreateUserDTO,
  session?: ClientSession,
): Promise<UserDocument> => {
  const [user] = await UserModel.create([payload], { session });
  return user;
};
