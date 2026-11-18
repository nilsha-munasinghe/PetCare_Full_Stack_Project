import { Response } from "express";
import PDFDocument from "pdfkit";
import Appointment from "../models/Appointment";
import { AuthRequest } from "../middleware/auth";

export async function appointmentReport(_req: AuthRequest, res: Response): Promise<void> {
  const rows = await Appointment.find().populate("pet").populate("service").populate("customer", "name email").sort({ date: -1 });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=petcare-appointments-report.pdf");
  const doc = new PDFDocument({ margin: 45 });
  doc.pipe(res);
  doc.fontSize(22).fillColor("#176b45").text("PetCare – Appointment Report");
  doc.moveDown().fontSize(10).fillColor("#555").text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown();
  rows.forEach((a, i) => {
    const pet = a.pet as unknown as { name?: string };
    const service = a.service as unknown as { name?: string };
    const customer = a.customer as unknown as { name?: string };
    doc.fontSize(11).fillColor("#222").text(`${i + 1}. ${pet?.name || "Pet"} | ${service?.name || "Service"}`);
    doc.fontSize(9).fillColor("#555").text(`${customer?.name || "Customer"} | ${new Date(a.date).toLocaleDateString()} ${a.time} | ${a.status}`);
    doc.moveDown(0.5);
  });
  doc.end();
}
