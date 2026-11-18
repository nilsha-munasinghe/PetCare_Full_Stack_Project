import { Response } from "express";
import Appointment from "../models/Appointment";
import Pet from "../models/Pet";
import Service from "../models/Service";
import { AuthRequest } from "../middleware/auth";

export async function listAppointments(req: AuthRequest, res: Response): Promise<void> {
  const filter = req.user?.role === "admin" ? {} : { customer: req.user?.id };
  const rows = await Appointment.find(filter).populate("pet").populate("service").populate("customer", "name email").sort({ date: -1 });
  res.json(rows);
}
export async function createAppointment(req: AuthRequest, res: Response): Promise<void> {
  const { pet, service, date, time, reason } = req.body;
  const ownedPet = await Pet.findOne({ _id: pet, owner: req.user?.id });
  if (!ownedPet) { res.status(400).json({ message: "Choose one of your registered pets" }); return; }
  const activeService = await Service.findOne({ _id: service, active: true });
  if (!activeService) { res.status(400).json({ message: "Please select a valid service" }); return; }
  const appointmentDate = new Date(date);
  if (Number.isNaN(appointmentDate.getTime()) || appointmentDate < new Date(new Date().toDateString())) {
    res.status(400).json({ message: "Please select a valid future date" }); return;
  }
  const conflict = await Appointment.findOne({ date: appointmentDate, time, status: { $in: ["Pending", "Confirmed"] } });
  if (conflict) { res.status(409).json({ message: "That time is already booked. Please choose another time." }); return; }
  const row = await Appointment.create({ customer: req.user?.id, pet, service, date: appointmentDate, time, reason });
  res.status(201).json(await row.populate(["pet", "service"]));
}
export async function updateAppointment(req: AuthRequest, res: Response): Promise<void> {
  const row = await Appointment.findById(req.params.id);
  if (!row) { res.status(404).json({ message: "Appointment not found" }); return; }
  if (req.user?.role !== "admin" && row.customer.toString() !== req.user?.id) { res.status(403).json({ message: "Not allowed" }); return; }
  const nextStatus = req.body.status;
  if (req.user?.role !== "admin" && nextStatus !== "Cancelled") { res.status(403).json({ message: "Customers can only cancel appointments" }); return; }
  if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(nextStatus)) { res.status(400).json({ message: "Invalid status" }); return; }
  row.status = nextStatus;
  await row.save();
  res.json(row);
}
