import { PaginationMeta } from '../http';

export type ExpensesTypes = {
  id: string;
  name: string;
  code: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  restaurantId: string;
};

export type ExpensesTypesList = {
  data: ExpensesTypes[];
  pagination: PaginationMeta;
};

export type ExpensesTypesResponse = {
  success: true;
  message: string;
  data: ExpensesTypes;
};

export type ExpensesTypesListResponse = {
  success: true;
  message: string;
  data: ExpensesTypesList;
};
