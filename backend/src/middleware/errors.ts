import { Request, Response, NextFunction } from "express";

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: "API route not found" });
}
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err.message);
  res.status(500).json({ message: "Server error", error: process.env.NODE_ENV === "production" ? undefined : err.message });
}
