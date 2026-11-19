import { Response } from "express";
import PDFDocument from "pdfkit";
import Appointment from "../models/Appointment";
import { AuthRequest } from "../middleware/auth";

type PopulatedPet = {
  name?: string;
  type?: string;
  breed?: string;
  age?: number;
};

type PopulatedService = {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
};

type PopulatedCustomer = {
  name?: string;
  email?: string;
};

function safe(value: unknown, fallback = "Not provided"): string {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function formatDate(value: Date | string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export async function appointmentReport(_req: AuthRequest, res: Response): Promise<void> {
  const appointments = await Appointment.find()
    .populate("pet", "name type breed age")
    .populate("service", "name description duration price")
    .populate("customer", "name email")
    .sort({ date: -1, time: -1 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="petcare-appointments-report.pdf"');

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 48, bottom: 48, left: 46, right: 46 },
    bufferPages: true,
    info: {
      Title: "PetCare Appointment Report",
      Author: "PetCare Booking System",
      Subject: "Complete appointment details"
    }
  });
  doc.pipe(res);

  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - 92;
  const green = "#176B45";
  const muted = "#64748B";
  let pageNumber = 1;

  const drawHeader = () => {
    doc.font("Helvetica-Bold").fontSize(20).fillColor(green)
      .text("PetCare", 46, 38, { continued: true });
    doc.font("Helvetica").fontSize(10).fillColor(muted)
      .text("  |  APPOINTMENT REPORT", { baseline: "middle" });
    doc.moveTo(46, 68).lineTo(pageWidth - 46, 68).lineWidth(1).strokeColor("#DCE7E1").stroke();
    doc.y = 82;
  };

  const drawFooter = () => {
    const y = doc.page.height - 32;
    doc.moveTo(46, y - 10).lineTo(pageWidth - 46, y - 10).lineWidth(0.6).strokeColor("#DCE7E1").stroke();
    doc.font("Helvetica").fontSize(8).fillColor(muted)
      .text("PetCare Booking System - Confidential report", 46, y, { width: contentWidth, align: "left" });
    doc.text(`Page ${pageNumber}`, 46, y, { width: contentWidth, align: "right" });
  };

  const newReportPage = () => {
    doc.addPage();
    pageNumber += 1;
    drawHeader();
  };

  drawHeader();
  doc.font("Helvetica-Bold").fontSize(17).fillColor("#172B22")
    .text("Appointment Summary", { width: contentWidth });
  doc.moveDown(0.35);
  doc.font("Helvetica").fontSize(9).fillColor(muted)
    .text(`Generated: ${new Date().toLocaleString("en-GB")}`);
  doc.moveDown(0.9);

  const counts = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "Pending").length,
    confirmed: appointments.filter((a) => a.status === "Confirmed").length,
    completed: appointments.filter((a) => a.status === "Completed").length,
    cancelled: appointments.filter((a) => a.status === "Cancelled").length
  };
  const summaryItems = [
    ["Total", counts.total],
    ["Pending", counts.pending],
    ["Confirmed", counts.confirmed],
    ["Completed", counts.completed],
    ["Cancelled", counts.cancelled]
  ];
  const gap = 8;
  const cardWidth = (contentWidth - gap * 4) / 5;
  const summaryY = doc.y;
  summaryItems.forEach(([label, value], index) => {
    const x = 46 + index * (cardWidth + gap);
    doc.roundedRect(x, summaryY, cardWidth, 43, 5).fill("#F1F7F3");
    doc.font("Helvetica-Bold").fontSize(15).fillColor(green)
      .text(String(value), x + 8, summaryY + 6, { width: cardWidth - 16 });
    doc.font("Helvetica").fontSize(7.5).fillColor(muted)
      .text(String(label).toUpperCase(), x + 8, summaryY + 26, { width: cardWidth - 16 });
  });
  doc.y = summaryY + 59;

  if (appointments.length === 0) {
    doc.font("Helvetica").fontSize(11).fillColor(muted)
      .text("There are no appointments to display.", { align: "center" });
  }

  appointments.forEach((appointment, index) => {
    const pet = appointment.pet as unknown as PopulatedPet | null;
    const service = appointment.service as unknown as PopulatedService | null;
    const customer = appointment.customer as unknown as PopulatedCustomer | null;
    const reason = safe(appointment.reason, "No reason provided");
    const details = [
      ["Customer", safe(customer?.name)],
      ["Email", safe(customer?.email)],
      ["Pet", safe(pet?.name)],
      ["Pet type / breed", [pet?.type, pet?.breed].filter(Boolean).join(" / ") || "Not provided"],
      ["Pet age", pet?.age === undefined ? "Not provided" : `${pet.age} year(s)`],
      ["Service", safe(service?.name)],
      ["Service details", safe(service?.description)],
      ["Duration", service?.duration === undefined ? "Not provided" : `${service.duration} minutes`],
      ["Service price", service?.price === undefined ? "Not provided" : `LKR ${service.price.toLocaleString("en-LK")}`],
      ["Appointment date", formatDate(appointment.date)],
      ["Appointment time", safe(appointment.time)],
      ["Reason / notes", reason],
      ["Status", safe(appointment.status)]
    ];

    const cardTop = doc.y;
    const labelWidth = 112;
    const valueWidth = contentWidth - labelWidth - 28;
    const rows = details.map(([label, value]) => {
      const valueHeight = doc.font("Helvetica").fontSize(8.5).heightOfString(value, { width: valueWidth });
      return { label, value, height: Math.max(15, valueHeight + 5) };
    });
    const cardHeight = 30 + rows.reduce((sum, row) => sum + row.height, 0) + 10;
    const availableBottom = doc.page.height - 55;

    if (cardTop + cardHeight > availableBottom && cardTop > 90) {
      newReportPage();
    }

    const top = doc.y;
    doc.roundedRect(46, top, contentWidth, cardHeight, 6).lineWidth(0.8).strokeColor("#DCE7E1").stroke();
    doc.roundedRect(46, top, contentWidth, 27, 6).fill("#EAF3ED");
    doc.font("Helvetica-Bold").fontSize(10).fillColor(green)
      .text(`APPOINTMENT ${String(index + 1).padStart(3, "0")}`, 56, top + 8);
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#334155")
      .text(safe(appointment.status).toUpperCase(), pageWidth - 46 - 112, top + 9, { width: 102, align: "right" });

    let rowY = top + 35;
    rows.forEach((row, rowIndex) => {
      if (rowIndex % 2 === 0) {
        doc.rect(52, rowY - 2, contentWidth - 12, row.height).fill("#FAFCFA");
      }
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#475569")
        .text(row.label, 57, rowY, { width: labelWidth });
      doc.font("Helvetica").fontSize(8.5).fillColor("#1E293B")
        .text(row.value, 57 + labelWidth, rowY, { width: valueWidth });
      rowY += row.height;
    });
    doc.y = top + cardHeight + 12;
  });

  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i += 1) {
    doc.switchToPage(i);
    const previousPage = pageNumber;
    pageNumber = i + 1;
    drawFooter();
    pageNumber = previousPage;
  }

  doc.end();
}
