import { Request, Response } from "express";
import Schedule from "../admin/schedule.model";
import User from "../auth/auth.model";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: {
    id: string;
    _id: string;
    role: string;
  };
}

interface UpdateProfileBody {
  fullName?: string;
  email?: string;
  age?: number;
  gender?: string;
  phone?: string;
  address?: string;
  password?: string;
}

export const bookSchedule = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { scheduleId } = req.params;
    const traineeId = req.user?.id;

    if (!traineeId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      res.status(404).json({ message: "Schedule not found" });
      return;
    }

    // Check if already booked
    if (schedule.trainees.includes(new mongoose.Types.ObjectId(traineeId))) {
      res.status(400).json({ message: "You already booked this schedule" });
      return;
    }

    if (schedule.trainees.length >= 10) {
      res
        .status(400)
        .json({ message: "Schedule is full. Please choose another one." });
      return;
    }

    // Add trainee to the schedule
    schedule.trainees.push(new mongoose.Types.ObjectId(traineeId));
    await schedule.save();

    res
      .status(200)
      .json({ message: "You have successfully booked the schedule" });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const updates = req.body as UpdateProfileBody;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Prevent password update from here if handled separately
    if (updates.password) {
      res.status(400).json({ message: "Password update not allowed here" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export const cancelBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { scheduleId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
      return;
    }

    // Check if the user is in the trainees array
    const isTrainee = schedule.trainees.some(
      (traineeId) => traineeId.toString() === userId
    );

    if (!isTrainee) {
      res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this schedule",
      });
      return;
    }

    // Remove the user from the trainees array
    schedule.trainees = schedule.trainees.filter(
      (traineeId) => traineeId.toString() !== userId
    );

    await schedule.save();

    res.status(200).json({
      success: true,
      message:
        "You have successfully cancelled your booking for this schedule.",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

export default {
  bookSchedule,
  getProfile,
  updateProfile,
  cancelBooking,
};
