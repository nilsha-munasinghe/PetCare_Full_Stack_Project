import { Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

export async function listUsers(_req: AuthRequest, res: Response): Promise<void> {
  const users = await User.find().select("-password -refreshTokenHash").sort({ createdAt: -1 });
  res.json(users);
}

export async function updateUserAccess(req: AuthRequest, res: Response): Promise<void> {
  const { role, isActive } = req.body as { role?: string; isActive?: boolean };
  if (role !== undefined && !["customer", "admin"].includes(role)) {
    res.status(400).json({ message: "Role must be customer or admin" }); return;
  }
  if (isActive !== undefined && typeof isActive !== "boolean") {
    res.status(400).json({ message: "isActive must be true or false" }); return;
  }
  if (role === undefined && isActive === undefined) {
    res.status(400).json({ message: "Provide a role or isActive value" }); return;
  }
  const userId = String(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: "Invalid user id" }); return;
  }
  const user = await User.findById(userId);
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  if (user.id === req.user?.id && (role === "customer" || isActive === false)) {
    res.status(400).json({ message: "You cannot remove your own administrator access" }); return;
  }
  const removingAdmin = user.role === "admin" && ((role === "customer") || isActive === false);
  if (removingAdmin) {
    const activeAdmins = await User.countDocuments({ role: "admin", isActive: true });
    if (activeAdmins <= 1) {
      res.status(400).json({ message: "At least one active administrator must remain" }); return;
    }
  }
  if (role !== undefined) user.role = role as "customer" | "admin";
  if (isActive !== undefined) user.isActive = isActive;
  await user.save();
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
}
