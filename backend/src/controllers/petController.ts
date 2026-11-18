import { Response } from "express";
import Pet from "../models/Pet";
import { AuthRequest } from "../middleware/auth";

export async function listPets(req: AuthRequest, res: Response): Promise<void> {
  const filter = req.user?.role === "admin" ? {} : { owner: req.user?.id };
  res.json(await Pet.find(filter).populate("owner", "name email").sort({ createdAt: -1 }));
}
export async function createPet(req: AuthRequest, res: Response): Promise<void> {
  const { name, type, breed, age, notes } = req.body;
  const pet = await Pet.create({ owner: req.user?.id, name, type, breed, age, notes });
  res.status(201).json(pet);
}
export async function updatePet(req: AuthRequest, res: Response): Promise<void> {
  const pet = await Pet.findById(req.params.id);
  if (!pet) { res.status(404).json({ message: "Pet not found" }); return; }
  if (req.user?.role !== "admin" && pet.owner.toString() !== req.user?.id) { res.status(403).json({ message: "Not allowed" }); return; }
  Object.assign(pet, req.body);
  await pet.save();
  res.json(pet);
}
export async function deletePet(req: AuthRequest, res: Response): Promise<void> {
  const pet = await Pet.findById(req.params.id);
  if (!pet) { res.status(404).json({ message: "Pet not found" }); return; }
  if (req.user?.role !== "admin" && pet.owner.toString() !== req.user?.id) { res.status(403).json({ message: "Not allowed" }); return; }
  await pet.deleteOne();
  res.json({ message: "Pet deleted" });
}
