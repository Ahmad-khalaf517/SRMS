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

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export const findUserByEmail = async (email: string): Promise<UserDocument | null> => {
  return UserModel.findOne({ email: email.toLowerCase() });
};

export const findUserById = async (id: string): Promise<UserDocument | null> => {
  return UserModel.findById(id);
};

export const createUser = async (
  payload: CreateUserInput,
  session?: ClientSession,
): Promise<UserDocument> => {
  const [user] = await UserModel.create([payload], { session });
  return user;
};
