import { type NextFunction, type Request, type RequestHandler, type Response } from 'express';
import { type ZodTypeAny } from 'zod';

import { ValidationError } from '@/shared/errors/app-error';

type ValidationSchemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export const validate = (schemas: ValidationSchemas): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        Object.assign(req.params, schemas.params.parse(req.params));
      }

      if (schemas.query) {
        Object.assign(req.query, schemas.query.parse(req.query));
      }

      next();
    } catch (error) {
      const details =
        error && typeof error === 'object' && 'issues' in error
          ? (
              (error as { issues?: Array<{ path?: Array<string | number>; message: string }> })
                .issues ?? []
            ).map((issue) => ({
              field: issue.path?.join('.'),
              message: issue.message,
            }))
          : undefined;

      next(new ValidationError('Validation error', details));
    }
  };
};

export default validate;
