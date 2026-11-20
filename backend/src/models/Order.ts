import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
}
export interface IOrder extends Document {
  customer: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  shippingAddress: string;
  phone: string;
  status: "Pending" | "Processing" | "Shipped" | "Completed" | "Cancelled";
}

const orderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 }
}, { _id: false });

const orderSchema = new Schema<IOrder>({
  customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: { type: [orderItemSchema], validate: [(items: IOrderItem[]) => items.length > 0, "An order must contain at least one item"] },
  total: { type: Number, required: true, min: 0 },
  shippingAddress: { type: String, required: true, trim: true, maxlength: 500 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  status: { type: String, enum: ["Pending", "Processing", "Shipped", "Completed", "Cancelled"], default: "Pending" }
}, { timestamps: true });

orderSchema.index({ createdAt: -1, customer: 1 });
export default mongoose.model<IOrder>("Order", orderSchema);
