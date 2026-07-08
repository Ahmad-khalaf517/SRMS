import { type RequestHandler } from 'express';

import { type AuthenticatedRequest } from '@/modules/auth/utils/auth.middleware';
import {
  getCurrentAuthUser,
  loginAuth,
  refreshAuth,
  registerAuth,
} from '@/modules/auth/service/auth.service';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { sendSuccess } from '@/shared/http/response';
import { env } from '@/config/env';

const REFRESH_COOKIE_NAME = env.REFRESH_COOKIE_NAME ?? 'srms_refresh_token';

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/api',
});

const setRefreshTokenCookie = (res: Parameters<RequestHandler>[1], refreshToken?: string) => {
  if (!refreshToken) {
    return;
  }

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
};

const clearRefreshTokenCookie = (res: Parameters<RequestHandler>[1]) => {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api',
  });
};

export const registerController: RequestHandler = async (req, res, next) => {
  try {
    const authData = await registerAuth(req.body);
    setRefreshTokenCookie(res, authData.refreshToken);
    sendSuccess(
      res,
      {
        user: authData.user,
        accessToken: authData.accessToken,
      },
      'Registration successful',
      201,
    );
  } catch (error) {
    next(error);
  }
};

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const authData = await loginAuth(req.body);
    setRefreshTokenCookie(res, authData.refreshToken);
    sendSuccess(
      res,
      { user: authData.user, accessToken: authData.accessToken },
      'Login successful',
    );
  } catch (error) {
    next(error);
  }
};

export const refreshController: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
    if (!refreshToken) {
      throw new UnauthorizedError('Missing refresh token');
    }

    const authData = await refreshAuth(refreshToken);
    sendSuccess(res, authData, 'Access token refreshed');
  } catch (error) {
    next(error);
  }
};

export const logoutController: RequestHandler = async (_req, res, next) => {
  try {
    clearRefreshTokenCookie(res);
    sendSuccess(res, null, 'Logout successful');
  } catch (error) {
    next(error);
  }
};

export const currentUserController: RequestHandler = async (req, res, next) => {
  try {
    const auth = (req as AuthenticatedRequest).auth;
    if (!auth) {
      throw new UnauthorizedError('Missing auth context');
    }

    const authData = await getCurrentAuthUser(auth.userId, auth.restaurantId, auth.accessToken);
    sendSuccess(res, authData, 'Current user loaded');
  } catch (error) {
    next(error);
  }
};
