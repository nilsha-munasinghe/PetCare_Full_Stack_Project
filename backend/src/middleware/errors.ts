import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
  statusCode?: number;
  code?: number;
  errors?: Record<string, { message?: string }>;
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: "API route not found" });
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err.message);
  if (err.name === "ValidationError") {
    const details = err.errors ? Object.values(err.errors).map((item) => item.message).filter(Boolean) : [];
    res.status(400).json({ message: "Validation failed", details }); return;
  }
  if (err.name === "CastError") {
    res.status(400).json({ message: "Invalid resource identifier" }); return;
  }
  if (err.code === 11000) {
    res.status(409).json({ message: "A record with this value already exists" }); return;
  }
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    message: status >= 500 ? "Server error. Please try again later." : err.message,
    ...(process.env.NODE_ENV !== "production" && status >= 500 ? { detail: err.message } : {})
  });
}
