import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User";

function resetTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("Email service is not configured");
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const email = String(req.body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: "Please enter a valid email address." });
    return;
  }

  const user = await User.findOne({ email });
  if (user && user.isActive) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim();
    const resetUrl = `${clientUrl}/reset-password?token=${rawToken}`;
    try {
      await resetTransport().sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: user.email,
        subject: "Reset your PetCare password",
        text: `We received a request to reset your PetCare password. Open this link within 15 minutes: ${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
        html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:28px;color:#254633"><h2>Reset your PetCare password</h2><p>Click below to choose a new password. This link expires in 15 minutes.</p><p><a href="${resetUrl}" style="display:inline-block;background:#218653;color:white;padding:13px 20px;border-radius:9px;text-decoration:none">Reset password</a></p><p>If you did not request this, you can ignore this email.</p></div>`
      });
    } catch (error) {
      user.passwordResetTokenHash = undefined;
      user.passwordResetExpiresAt = undefined;
      await user.save();
      throw error;
    }
  }

  res.json({ message: "If an account exists for that email, a password reset link has been sent." });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const token = String(req.body.token || "");
  const password = String(req.body.password || "");
  if (password.length < 8) {
    res.status(400).json({ message: "Password must contain at least 8 characters." });
    return;
  }
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    res.status(400).json({ message: "This reset link is invalid or expired. Please request a new one." });
    return;
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
    isActive: true
  }).select("+passwordResetTokenHash +passwordResetExpiresAt +refreshTokenHash");

  if (!user) {
    res.status(400).json({ message: "This reset link is invalid or expired. Please request a new one." });
    return;
  }

  user.password = await bcrypt.hash(password, 12);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpiresAt = undefined;
  user.refreshTokenHash = undefined;
  await user.save();
  res.json({ message: "Your password has been reset. Please sign in with your new password." });
}
