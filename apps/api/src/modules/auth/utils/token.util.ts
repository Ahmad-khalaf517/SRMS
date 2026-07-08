import jwt, { type SignOptions } from 'jsonwebtoken';

import { UnauthorizedError } from '@/shared/errors/app-error';
import { env } from '@/config/env';
import { UserRole } from '@srms/api-contracts';

type AccessTokenPayload = {
  userId: string;
  restaurantId: string;
  role: UserRole;
};

type RefreshTokenPayload = {
  userId: string;
};

const ACCESS_TOKEN_SECRET = env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = env.JWT_REFRESH_SECRET!;
const ACCESS_TOKEN_TTL: SignOptions['expiresIn'] =
  (env.JWT_ACCESS_TTL as SignOptions['expiresIn']) ?? '15m';
const REFRESH_TOKEN_TTL: SignOptions['expiresIn'] =
  (env.JWT_REFRESH_TTL as SignOptions['expiresIn']) ?? '7d';

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_TTL });
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_TTL });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};
