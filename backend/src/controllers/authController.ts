import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import { AuthRequest } from "../middleware/auth";

type Role = "customer" | "admin";
interface TokenPayload { id: string; role: Role; kind?: "access" | "refresh"; }

function accessSecret(): string {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is not configured");
  return value;
}
function refreshSecret(): string {
  const value = process.env.JWT_REFRESH_SECRET;
  if (!value) throw new Error("JWT_REFRESH_SECRET is not configured");
  return value;
}
function makeAccessToken(user: IUser): string {
  return jwt.sign(
    { id: user.id, role: user.role, kind: "access" } satisfies TokenPayload,
    accessSecret(),
    { expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "15m") as jwt.SignOptions["expiresIn"] }
  );
}
function makeRefreshToken(user: IUser): string {
  return jwt.sign(
    { id: user.id, role: user.role, kind: "refresh" } satisfies TokenPayload,
    refreshSecret(),
    { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"] }
  );
}
async function tokenResponse(user: IUser) {
  const accessToken = makeAccessToken(user);
  const refreshToken = makeRefreshToken(user);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 12);
  await user.save();
  return {
    token: accessToken,
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
    res.status(400).json({ message: "Enter a valid name, email and password with at least 8 characters" }); return;
  }
  const exists = await User.findOne({ email });
  if (exists) { res.status(409).json({ message: "Email already registered" }); return; }
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  res.status(201).json(await tokenResponse(user));
}

export async function login(req: Request, res: Response): Promise<void> {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!email || !password) { res.status(400).json({ message: "Email and password are required" }); return; }
  const user = await User.findOne({ email }).select("+password +refreshTokenHash");
  if (!user || !await bcrypt.compare(password, user.password)) {
    res.status(401).json({ message: "Incorrect email or password" }); return;
  }
  if (!user.isActive) { res.status(403).json({ message: "This account is disabled. Please contact an administrator." }); return; }
  res.json(await tokenResponse(user));
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshToken = String(req.body.refreshToken || "");
  if (!refreshToken) { res.status(401).json({ message: "Refresh token is required" }); return; }
  let payload: TokenPayload;
  try {
    payload = jwt.verify(refreshToken, refreshSecret()) as TokenPayload;
    if (payload.kind !== "refresh" || !payload.id) throw new Error("Invalid refresh token");
  } catch {
    res.status(401).json({ message: "Refresh token is invalid or expired. Please sign in again." }); return;
  }
  const user = await User.findById(payload.id).select("+refreshTokenHash");
  if (!user || !user.isActive || !user.refreshTokenHash || !await bcrypt.compare(refreshToken, user.refreshTokenHash)) {
    res.status(401).json({ message: "Refresh token is no longer valid. Please sign in again." }); return;
  }
  res.json(await tokenResponse(user));
}

export async function logout(req: Request, res: Response): Promise<void> {
  const refreshToken = String(req.body.refreshToken || "");
  if (refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, refreshSecret()) as TokenPayload;
      const user = await User.findById(payload.id).select("+refreshTokenHash");
      if (user?.refreshTokenHash && await bcrypt.compare(refreshToken, user.refreshTokenHash)) {
        user.refreshTokenHash = undefined;
        await user.save();
      }
    } catch {
      // Expired refresh tokens can still be removed from the client.
    }
  }
  res.json({ message: "Signed out successfully" });
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.user?.id).select("-password -refreshTokenHash");
  if (!user || !user.isActive) { res.status(404).json({ message: "User not found" }); return; }
  res.json({ user });
}
