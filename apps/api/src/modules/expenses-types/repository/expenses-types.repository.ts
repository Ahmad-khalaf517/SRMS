import { type CreateExpensesTypesDTO, type UpdateExpensesTypesDTO } from '@srms/api-contracts';
import { model, Schema, type InferSchemaType, type Types } from 'mongoose';

const expensesTypesSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  },
  { timestamps: true },
);

expensesTypesSchema.index({ restaurantId: 1 });
expensesTypesSchema.index({ restaurantId: 1, createdAt: -1 });
expensesTypesSchema.index({ name: 1, restaurantId: 1 }, { unique: true });

export type ExpensesTypesDocument = InferSchemaType<typeof expensesTypesSchema> & {
  _id: Types.ObjectId;
};

const ExpensesTypesModel = model<ExpensesTypesDocument>('ExpensesTypes', expensesTypesSchema);

type PaginatedResult = {
  docs: ExpensesTypesDocument[];
  total: number;
};

export const findExpensesTypesByRestaurant = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<PaginatedResult> => {
  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    ExpensesTypesModel.find({ restaurantId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ExpensesTypesModel.countDocuments({ restaurantId }),
  ]);
  return { docs: docs as ExpensesTypesDocument[], total };
};

export const findExpensesTypesById = async (
  id: string,
  restaurantId: string,
): Promise<ExpensesTypesDocument | null> => {
  return ExpensesTypesModel.findOne({
    _id: id,
    restaurantId,
  }).lean() as Promise<ExpensesTypesDocument | null>;
};

export const findExpensesTypesByName = async (
  name: string,
  restaurantId: string,
  excludeId?: string,
): Promise<ExpensesTypesDocument | null> => {
  const query: Record<string, unknown> = { name, restaurantId };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  return ExpensesTypesModel.findOne(query).lean() as Promise<ExpensesTypesDocument | null>;
};

export const createExpensesTypes = async (
  payload: CreateExpensesTypesDTO & { restaurantId: string },
): Promise<ExpensesTypesDocument> => {
  const doc = await ExpensesTypesModel.create(payload);
  return doc.toObject() as ExpensesTypesDocument;
};

export const updateExpensesTypesById = async (
  id: string,
  restaurantId: string,
  payload: UpdateExpensesTypesDTO,
): Promise<ExpensesTypesDocument | null> => {
  return ExpensesTypesModel.findOneAndUpdate(
    { _id: id, restaurantId },
    { $set: payload },
    { new: true },
  ).lean() as Promise<ExpensesTypesDocument | null>;
};

export const deleteExpensesTypesById = async (
  id: string,
  restaurantId: string,
): Promise<ExpensesTypesDocument | null> => {
  return ExpensesTypesModel.findOneAndDelete({
    _id: id,
    restaurantId,
  }).lean() as Promise<ExpensesTypesDocument | null>;
};
