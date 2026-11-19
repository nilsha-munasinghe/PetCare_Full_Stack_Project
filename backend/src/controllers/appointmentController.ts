import { Response } from "express";
import mongoose from "mongoose";
import Appointment from "../models/Appointment";
import Pet from "../models/Pet";
import Service from "../models/Service";
import { AuthRequest } from "../middleware/auth";

function validDateTime(date: unknown, time: unknown): Date | null {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      typeof time !== "string" || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return null;
  const value = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(value.getTime()) || value.toISOString().slice(0, 10) !== date) return null;
  const now = new Date();
  const chosen = new Date(`${date}T${time}:00.000Z`);
  if (chosen.getTime() < now.getTime()) return null;
  return value;
}
async function hasConflict(date: Date, time: string, excludeId?: string): Promise<boolean> {
  const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const filter: Record<string, unknown> = {
    date: { $gte: date, $lt: nextDay }, time, status: { $in: ["Pending", "Confirmed"] }
  };
  if (excludeId) filter._id = { $ne: excludeId };
  return Boolean(await Appointment.findOne(filter));
}

export async function listAppointments(req: AuthRequest, res: Response): Promise<void> {
  const filter = req.user?.role === "admin" ? {} : { customer: req.user?.id };
  const rows = await Appointment.find(filter).populate("pet").populate("service").populate("customer", "name email").sort({ date: -1 });
  res.json(rows);
}
export async function createAppointment(req: AuthRequest, res: Response): Promise<void> {
  const { pet, service, date, time, reason } = req.body;
  if (!mongoose.Types.ObjectId.isValid(String(pet || "")) || !mongoose.Types.ObjectId.isValid(String(service || ""))) {
    res.status(400).json({ message: "Select a valid pet and service" }); return;
  }
  const appointmentDate = validDateTime(date, time);
  if (!appointmentDate) { res.status(400).json({ message: "Choose a valid future date and time" }); return; }
  const ownedPet = await Pet.findOne({ _id: pet, owner: req.user?.id });
  if (!ownedPet) { res.status(400).json({ message: "Choose one of your registered pets" }); return; }
  const activeService = await Service.findOne({ _id: service, active: true });
  if (!activeService) { res.status(400).json({ message: "Please select a valid service" }); return; }
  if (await hasConflict(appointmentDate, time)) {
    res.status(409).json({ message: "That time is already booked. Please choose another time." }); return;
  }
  const row = await Appointment.create({
    customer: req.user?.id, pet, service, date: appointmentDate, time,
    reason: String(reason || "").trim().slice(0, 500)
  });
  res.status(201).json(await row.populate(["pet", "service"]));
}
export async function rescheduleAppointment(req: AuthRequest, res: Response): Promise<void> {
  const row = await Appointment.findById(req.params.id);
  if (!row) { res.status(404).json({ message: "Appointment not found" }); return; }
  if (req.user?.role !== "admin" && row.customer.toString() !== req.user?.id) {
    res.status(403).json({ message: "Not allowed" }); return;
  }
  if (row.status !== "Pending") {
    res.status(400).json({ message: "Only pending appointments can be rescheduled" }); return;
  }
  const nextDate = validDateTime(req.body.date, req.body.time);
  if (!nextDate) { res.status(400).json({ message: "Choose a valid future date and time" }); return; }
  if (await hasConflict(nextDate, String(req.body.time), row.id)) {
    res.status(409).json({ message: "That time is already booked. Please choose another time." }); return;
  }
  row.date = nextDate;
  row.time = String(req.body.time);
  if (req.body.reason !== undefined) row.reason = String(req.body.reason).trim().slice(0, 500);
  await row.save();
  res.json(await row.populate(["pet", "service"]));
}
export async function updateAppointment(req: AuthRequest, res: Response): Promise<void> {
  const row = await Appointment.findById(req.params.id);
  if (!row) { res.status(404).json({ message: "Appointment not found" }); return; }
  if (req.user?.role !== "admin" && row.customer.toString() !== req.user?.id) {
    res.status(403).json({ message: "Not allowed" }); return;
  }
  const nextStatus = req.body.status;
  if (req.user?.role !== "admin" && (nextStatus !== "Cancelled" || row.status === "Completed")) {
    res.status(403).json({ message: "Customers can only cancel pending or confirmed appointments" }); return;
  }
  if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(nextStatus)) {
    res.status(400).json({ message: "Invalid status" }); return;
  }
  row.status = nextStatus;
  await row.save();
  res.json(row);
}
