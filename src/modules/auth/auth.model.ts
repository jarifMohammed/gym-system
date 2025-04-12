import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  age?: number;
  gender?: "male" | "female" | "other";
  phone?: string;
  address?: string;
  role: "trainer" | "trainee";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: { type: String, required: true }, // already hashed in auth module
    age: Number,
    gender: { type: String, enum: ["male", "female", "other"] },
    phone: String,
    address: String,
    role: {
      type: String,
      enum: ["trainer", "trainee"], // Added both roles
      default: "trainee", // Default role is trainee
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
