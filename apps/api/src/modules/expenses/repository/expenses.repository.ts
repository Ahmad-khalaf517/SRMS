import { type CreateExpensesDTO, type UpdateExpensesDTO } from '@srms/api-contracts';
import { model, Schema, type InferSchemaType, type Types } from 'mongoose';

const expenseSchema = new Schema(
  {
    expenseNo: { type: String, required: true, trim: true, unique: true },
    expenseTypeId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

expenseSchema.index({ restaurantId: 1 });
expenseSchema.index({ restaurantId: 1, createdAt: -1 });
expenseSchema.index({ restaurantId: 1, date: -1 });

export type ExpenseDocument = InferSchemaType<typeof expenseSchema> & { _id: Types.ObjectId };

const ExpenseModel = model<ExpenseDocument>('Expense', expenseSchema);

type PaginatedResult = {
  docs: ExpenseDocument[];
  total: number;
};

export const findExpensesByRestaurant = async (
  restaurantId: string,
  page: number,
  limit: number,
): Promise<PaginatedResult> => {
  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    ExpenseModel.find({ restaurantId }).sort({ date: -1 }).skip(skip).limit(limit).lean(),
    ExpenseModel.countDocuments({ restaurantId }),
  ]);
  return { docs: docs as ExpenseDocument[], total };
};

export const findExpenseById = async (
  id: string,
  restaurantId: string,
): Promise<ExpenseDocument | null> => {
  return ExpenseModel.findOne({
    _id: id,
    restaurantId,
  }).lean() as Promise<ExpenseDocument | null>;
};

export const createExpense = async (
  payload: CreateExpensesDTO & { restaurantId: string; createdBy: string },
): Promise<ExpenseDocument> => {
  const doc = await ExpenseModel.create(payload);
  return doc.toObject() as ExpenseDocument;
};

export const updateExpenseById = async (
  id: string,
  restaurantId: string,
  payload: UpdateExpensesDTO,
): Promise<ExpenseDocument | null> => {
  return ExpenseModel.findOneAndUpdate(
    { _id: id, restaurantId },
    { $set: payload },
    { new: true },
  ).lean() as Promise<ExpenseDocument | null>;
};

export const deleteExpenseById = async (
  id: string,
  restaurantId: string,
): Promise<ExpenseDocument | null> => {
  return ExpenseModel.findOneAndDelete({
    _id: id,
    restaurantId,
  }).lean() as Promise<ExpenseDocument | null>;
};
