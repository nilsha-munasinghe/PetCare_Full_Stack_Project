import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  duration: number;
  active: boolean;
}

const serviceSchema = new Schema<IService>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 10 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IService>("Service", serviceSchema);
