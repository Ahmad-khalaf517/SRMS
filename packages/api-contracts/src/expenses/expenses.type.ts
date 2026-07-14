import { PaginationMeta } from '../http';

export type Expenses = {
  id: string;
  expenseNo: string;
  expenseTypeId: string;
  title: string;
  description?: string;
  amount: number;
  date: string;
  restaurantId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ExpensesList = {
  data: Expenses[];
  pagination: PaginationMeta;
};

export type ExpensesResponse = {
  success: true;
  message: string;
  data: Expenses;
};

export type ExpensesListResponse = {
  success: true;
  message: string;
  data: ExpensesList;
};
