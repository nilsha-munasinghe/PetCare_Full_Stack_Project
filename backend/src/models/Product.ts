import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  category: "Food" | "Treats" | "Accessories" | "Other";
  price: number;
  stock: number;
  imageUrl?: string;
  active: boolean;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  category: { type: String, enum: ["Food", "Treats", "Accessories", "Other"], default: "Food" },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  imageUrl: { type: String, trim: true, default: "" },
  active: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ name: 1, category: 1 });
export default mongoose.model<IProduct>("Product", productSchema);
