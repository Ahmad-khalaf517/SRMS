import { Request, Response } from "express";

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
) => {
    console.log("GLOBAL ERROR MIDDLEWARE");
    console.error(err);
    res.status(500).json({ message: err.message });
};

export default errorHandler;