import { Router } from "express";
import { register, login, me } from "../controllers/authController";
import { listPets, createPet, updatePet, deletePet } from "../controllers/petController";
import { listServices, createService, updateService, deleteService } from "../controllers/serviceController";
import { listAppointments, createAppointment, updateAppointment } from "../controllers/appointmentController";
import { appointmentReport } from "../controllers/reportController";
import { protect, adminOnly } from "../middleware/auth";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", protect, me);

router.get("/pets", protect, listPets);
router.post("/pets", protect, createPet);
router.put("/pets/:id", protect, updatePet);
router.delete("/pets/:id", protect, deletePet);

router.get("/services", listServices);
router.post("/services", protect, adminOnly, createService);
router.put("/services/:id", protect, adminOnly, updateService);
router.delete("/services/:id", protect, adminOnly, deleteService);

router.get("/appointments", protect, listAppointments);
router.post("/appointments", protect, createAppointment);
router.patch("/appointments/:id", protect, updateAppointment);
router.get("/reports/appointments.pdf", protect, adminOnly, appointmentReport);

router.get("/admin/summary", protect, adminOnly, async (_req, res) => {
  const { default: User } = await import("../models/User");
  const { default: Pet } = await import("../models/Pet");
  const { default: Service } = await import("../models/Service");
  const { default: Appointment } = await import("../models/Appointment");
  const [users, pets, services, appointments, pending] = await Promise.all([
    User.countDocuments(), Pet.countDocuments(), Service.countDocuments(),
    Appointment.countDocuments(), Appointment.countDocuments({ status: "Pending" })
  ]);
  res.json({ users, pets, services, appointments, pending });
});

export default router;
