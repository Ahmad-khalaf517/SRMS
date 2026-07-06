import { NextFunction, Request, Response } from 'express';

const logRequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
};

export default logRequestHandler;
