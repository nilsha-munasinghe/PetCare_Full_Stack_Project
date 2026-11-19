import { Router } from "express";
import { register, login, refresh, logout, me } from "../controllers/authController";
import { listPets, createPet, updatePet, deletePet } from "../controllers/petController";
import { listServices, createService, updateService, deleteService } from "../controllers/serviceController";
import { listAppointments, createAppointment, updateAppointment, rescheduleAppointment } from "../controllers/appointmentController";
import { appointmentReport } from "../controllers/reportController";
import { listUsers, updateUserAccess } from "../controllers/userController";
import {
  listProducts, listAdminProducts, createProduct, updateProduct, deleteProduct,
  createOrder, listOrders, updateOrderStatus
} from "../controllers/shopController";
import { protect, adminOnly } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";
import User from "../models/User";
import Pet from "../models/Pet";
import Service from "../models/Service";
import Appointment from "../models/Appointment";
import Product from "../models/Product";
import Order from "../models/Order";

const router = Router();

router.post("/auth/register", asyncHandler(register));
router.post("/auth/login", asyncHandler(login));
router.post("/auth/refresh", asyncHandler(refresh));
router.post("/auth/logout", asyncHandler(logout));
router.get("/auth/me", protect, asyncHandler(me));

router.get("/pets", protect, asyncHandler(listPets));
router.post("/pets", protect, asyncHandler(createPet));
router.put("/pets/:id", protect, asyncHandler(updatePet));
router.delete("/pets/:id", protect, asyncHandler(deletePet));

router.get("/services", asyncHandler(listServices));
router.post("/services", protect, adminOnly, asyncHandler(createService));
router.put("/services/:id", protect, adminOnly, asyncHandler(updateService));
router.delete("/services/:id", protect, adminOnly, asyncHandler(deleteService));

router.get("/appointments", protect, asyncHandler(listAppointments));
router.post("/appointments", protect, asyncHandler(createAppointment));
router.patch("/appointments/:id/reschedule", protect, asyncHandler(rescheduleAppointment));
router.patch("/appointments/:id", protect, asyncHandler(updateAppointment));

router.get("/admin/summary", protect, adminOnly, asyncHandler(async (_req, res) => {
  const [users, pets, services, appointments, pending, products, orders] = await Promise.all([
    User.countDocuments(), Pet.countDocuments(), Service.countDocuments({ active: true }),
    Appointment.countDocuments(), Appointment.countDocuments({ status: "Pending" }),
    Product.countDocuments({ active: true }), Order.countDocuments()
  ]);
  res.json({ users, pets, services, appointments, pending, products, orders });
}));
router.get("/admin/users", protect, adminOnly, asyncHandler(listUsers));
router.patch("/admin/users/:id", protect, adminOnly, asyncHandler(updateUserAccess));

router.get("/reports/appointments.pdf", protect, adminOnly, asyncHandler(appointmentReport));

router.get("/shop/products", asyncHandler(listProducts));
router.get("/shop/admin/products", protect, adminOnly, asyncHandler(listAdminProducts));
router.post("/shop/products", protect, adminOnly, asyncHandler(createProduct));
router.put("/shop/products/:id", protect, adminOnly, asyncHandler(updateProduct));
router.delete("/shop/products/:id", protect, adminOnly, asyncHandler(deleteProduct));
router.post("/shop/orders", protect, asyncHandler(createOrder));
router.get("/shop/orders", protect, asyncHandler(listOrders));
router.patch("/shop/orders/:id", protect, asyncHandler(updateOrderStatus));

export default router;
