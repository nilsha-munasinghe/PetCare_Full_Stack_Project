import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "customer" | "admin";
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, minlength: 2 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ["customer", "admin"], default: "customer" }
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);
