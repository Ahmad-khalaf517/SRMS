import {
  type Restaurant,
  type CreateRestaurantDTO,
  type UpdateRestaurantDTO,
} from '@srms/api-contracts';
import {
  createRestaurant as dbCreateRestaurant,
  findRestaurantById,
  updateRestaurantById,
} from '@/modules/restaurants/repository/restaurant.repository';
import { NotFoundError } from '@/shared/errors/app-error';
import type { RestaurantDocument } from '@/modules/restaurants/repository/restaurant.repository';
import { ClientSession } from 'mongoose';

const toDTO = (doc: RestaurantDocument): Restaurant => ({
  id: doc._id.toString(),
  name: doc.name as string,
  address: doc.address as string,
  phone: doc.phone as string,
  email: doc.email as string,
  logo: doc.logo as string | undefined,
  isActive: doc.isActive as boolean,
  createdAt: (doc.createdAt as Date).toISOString(),
  updatedAt: (doc.updatedAt as Date).toISOString(),
});

const sanitizeInput = <T extends CreateRestaurantDTO | UpdateRestaurantDTO>(dto: T): T => {
  const sanitized: T = { ...dto };

  if (sanitized.name !== undefined) {
    sanitized.name = sanitized.name.trim();
  }

  if (sanitized.address !== undefined) {
    sanitized.address = sanitized.address.trim();
  }

  if (sanitized.phone !== undefined) {
    sanitized.phone = sanitized.phone.trim();
  }

  if (sanitized.email !== undefined) {
    sanitized.email = sanitized.email.trim().toLowerCase();
  }

  if (sanitized.logo !== undefined) {
    sanitized.logo = sanitized.logo.trim();
  }

  return sanitized;
};

export const createRestaurantService = async (
  dto: CreateRestaurantDTO,
  session?: ClientSession,
): Promise<Restaurant> => {
  const sanitized = sanitizeInput(dto);

  const doc = await dbCreateRestaurant(sanitized, session);
  return toDTO(doc);
};

export const updateRestaurantService = async (
  id: string,
  dto: UpdateRestaurantDTO,
): Promise<Restaurant> => {
  const existing = await findRestaurantById(id);
  if (!existing) {
    throw new NotFoundError('Restaurant not found');
  }

  const sanitized = sanitizeInput(dto);

  const updated = await updateRestaurantById(id, sanitized);
  if (!updated) {
    throw new NotFoundError('Restaurant not found');
  }
  return toDTO(updated);
};

export const findRestaurantByIdService = async (id: string): Promise<Restaurant> => {
  const existing = await findRestaurantById(id);
  if (!existing) {
    throw new NotFoundError('Restaurant not found');
  }
  return toDTO(existing);
};
