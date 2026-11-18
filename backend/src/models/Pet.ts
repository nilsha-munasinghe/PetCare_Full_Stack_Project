import mongoose, { Schema, Document } from "mongoose";

export interface IPet extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  type: string;
  breed: string;
  age: number;
  notes?: string;
}

const petSchema = new Schema<IPet>({
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ["Dog", "Cat", "Bird", "Other"] },
  breed: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  notes: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model<IPet>("Pet", petSchema);
