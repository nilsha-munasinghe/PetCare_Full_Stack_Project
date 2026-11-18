import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; role: "customer" | "admin" };
}

export function protect(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required" }); return;
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET missing");
    const decoded = jwt.verify(header.slice(7), secret) as { id: string; role: "customer" | "admin" };
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin access required" }); return;
  }
  next();
}
