import { Request, Response } from "express";

const notFoundHandler = (
    req: Request,
    res: Response,
) => {
    console.log("ROUTE NOT FOUND");
    res.status(404).json({ message: "Route not found" });
};

export default notFoundHandler;