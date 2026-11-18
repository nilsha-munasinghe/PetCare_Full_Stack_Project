import { Request, Response } from "express";
import Service from "../models/Service";

export async function listServices(_req: Request, res: Response): Promise<void> {
  res.json(await Service.find({ active: true }).sort({ name: 1 }));
}
export async function createService(req: Request, res: Response): Promise<void> {
  res.status(201).json(await Service.create(req.body));
}
export async function updateService(req: Request, res: Response): Promise<void> {
  const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) { res.status(404).json({ message: "Service not found" }); return; }
  res.json(item);
}
export async function deleteService(req: Request, res: Response): Promise<void> {
  const item = await Service.findByIdAndDelete(req.params.id);
  if (!item) { res.status(404).json({ message: "Service not found" }); return; }
  res.json({ message: "Service deleted" });
}
