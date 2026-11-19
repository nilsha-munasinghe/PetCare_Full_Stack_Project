import { Response } from "express";
import mongoose from "mongoose";
import Pet from "../models/Pet";
import Appointment from "../models/Appointment";
import { AuthRequest } from "../middleware/auth";

export async function listPets(req: AuthRequest, res: Response): Promise<void> {
  const filter = req.user?.role === "admin" ? {} : { owner: req.user?.id };
  res.json(await Pet.find(filter).populate("owner", "name email").sort({ createdAt: -1 }));
}
export async function createPet(req: AuthRequest, res: Response): Promise<void> {
  const { name, type, breed, age, notes } = req.body;
  if (!String(name || "").trim() || !String(breed || "").trim() ||
      !["Dog", "Cat", "Bird", "Other"].includes(type) ||
      !Number.isFinite(Number(age)) || Number(age) < 0 || Number(age) > 100) {
    res.status(400).json({ message: "Enter a pet name, valid type, breed and age" }); return;
  }
  const pet = await Pet.create({
    owner: req.user?.id, name: String(name).trim(), type, breed: String(breed).trim(),
    age: Number(age), notes: String(notes || "").trim().slice(0, 500)
  });
  res.status(201).json(pet);
}
export async function updatePet(req: AuthRequest, res: Response): Promise<void> {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { res.status(400).json({ message: "Invalid pet id" }); return; }
  const pet = await Pet.findById(req.params.id);
  if (!pet) { res.status(404).json({ message: "Pet not found" }); return; }
  if (req.user?.role !== "admin" && pet.owner.toString() !== req.user?.id) {
    res.status(403).json({ message: "Not allowed" }); return;
  }
  const { name, type, breed, age, notes } = req.body;
  if (name !== undefined) pet.name = String(name).trim();
  if (type !== undefined) pet.type = type;
  if (breed !== undefined) pet.breed = String(breed).trim();
  if (age !== undefined) pet.age = Number(age);
  if (notes !== undefined) pet.notes = String(notes).trim().slice(0, 500);
  await pet.save();
  res.json(pet);
}
export async function deletePet(req: AuthRequest, res: Response): Promise<void> {
  const pet = await Pet.findById(req.params.id);
  if (!pet) { res.status(404).json({ message: "Pet not found" }); return; }
  if (req.user?.role !== "admin" && pet.owner.toString() !== req.user?.id) {
    res.status(403).json({ message: "Not allowed" }); return;
  }
  const linked = await Appointment.exists({ pet: pet._id, status: { $in: ["Pending", "Confirmed"] } });
  if (linked) { res.status(409).json({ message: "This pet has an active appointment. Cancel or complete it before deleting the pet." }); return; }
  await pet.deleteOne();
  res.json({ message: "Pet deleted" });
}
