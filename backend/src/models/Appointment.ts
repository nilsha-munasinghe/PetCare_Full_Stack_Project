import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  customer: mongoose.Types.ObjectId;
  pet: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  date: Date;
  time: string;
  reason?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

const appointmentSchema = new Schema<IAppointment>({
  customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  pet: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
  service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
  reason: { type: String, default: "", maxlength: 500 },
  status: { type: String, enum: ["Pending", "Confirmed", "Completed", "Cancelled"], default: "Pending" }
}, { timestamps: true });

appointmentSchema.index({ date: 1, time: 1, status: 1 });
export default mongoose.model<IAppointment>("Appointment", appointmentSchema);
