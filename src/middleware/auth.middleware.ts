import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import User, { IUser } from "../modules/auth/auth.model";
import mongoose from "mongoose";

export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.token || "") as {
      id: string;
    };
    const user = (await User.findById(decoded.id)) as
      | (IUser & { _id: mongoose.Types.ObjectId })
      | null;

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
