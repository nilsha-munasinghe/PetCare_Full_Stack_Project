import { Request, Response } from "express";
import Service from "../models/Service";

export async function listServices(_req: Request, res: Response): Promise<void> {
  res.json(await Service.find({ active: true }).sort({ name: 1 }));
}
export async function createService(req: Request, res: Response): Promise<void> {
  const { name, description, price, duration } = req.body;
  if (!String(name || "").trim() || !String(description || "").trim() ||
      !Number.isFinite(Number(price)) || Number(price) < 0 ||
      !Number.isInteger(Number(duration)) || Number(duration) < 10) {
    res.status(400).json({ message: "Enter a name, description, non-negative price and duration of at least 10 minutes" }); return;
  }
  res.status(201).json(await Service.create({ name, description, price: Number(price), duration: Number(duration) }));
}
export async function updateService(req: Request, res: Response): Promise<void> {
  const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) { res.status(404).json({ message: "Service not found" }); return; }
  res.json(item);
}
export async function deleteService(req: Request, res: Response): Promise<void> {
  const item = await Service.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
  if (!item) { res.status(404).json({ message: "Service not found" }); return; }
  res.json({ message: "Service deactivated" });
}
