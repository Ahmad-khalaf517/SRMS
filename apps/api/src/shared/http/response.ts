import { type Response } from 'express';

type SuccessEnvelope<T> = {
  success: true;
  message: string;
  data: T;
};

type ErrorEnvelope = {
  success: false;
  message: string;
  errors: Array<unknown>;
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'OK',
  statusCode = 200,
): Response<SuccessEnvelope<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  errors: Array<unknown> = [],
  statusCode = 500,
): Response<ErrorEnvelope> => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
