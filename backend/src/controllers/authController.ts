import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

function makeToken(id: string, role: "customer" | "admin"): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  return jwt.sign({ id, role }, secret, { expiresIn: (process.env.JWT_EXPIRES_IN || "1d") as jwt.SignOptions["expiresIn"] });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body as { name: string; email: string; password: string };
  if (!name?.trim() || !email?.trim() || !password || password.length < 8) {
    res.status(400).json({ message: "Name, valid email and password (at least 8 characters) are required" }); return;
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) { res.status(409).json({ message: "Email already registered" }); return; }
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  res.status(201).json({ token: makeToken(user.id, user.role), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !await bcrypt.compare(password || "", user.password)) {
    res.status(401).json({ message: "Incorrect email or password" }); return;
  }
  res.json({ token: makeToken(user.id, user.role), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.user?.id).select("-password");
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  res.json({ user });
}
