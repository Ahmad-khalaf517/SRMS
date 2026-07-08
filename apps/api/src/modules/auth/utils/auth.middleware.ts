import { type NextFunction, type Request, type RequestHandler, type Response } from 'express';

import { ForbiddenError, UnauthorizedError } from '@/shared/errors/app-error';
import { verifyAccessToken } from '@/modules/auth/utils/token.util';
import { UserRole } from '@srms/api-contracts';

export type AuthContext = {
  userId: string;
  restaurantId: string;
  role: UserRole;
  accessToken: string;
};

export type AuthenticatedRequest = Request & {
  auth?: AuthContext;
};

const getAccessTokenFromRequest = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
};

export const authenticate: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = getAccessTokenFromRequest(req);
    if (!token) {
      throw new UnauthorizedError('Missing access token');
    }

    const payload = verifyAccessToken(token);
    (req as AuthenticatedRequest).auth = {
      userId: payload.userId,
      restaurantId: payload.restaurantId,
      role: payload.role,
      accessToken: token,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (allowedRoles: UserRole[]): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const auth = (req as AuthenticatedRequest).auth;
    if (!auth) {
      return next(new UnauthorizedError('Missing authentication context'));
    }

    if (!allowedRoles.includes(auth.role)) {
      return next(new ForbiddenError('Insufficient permission for this resource'));
    }

    next();
  };
};
