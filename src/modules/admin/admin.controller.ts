import { Request, Response } from "express";
import Schedule from "./schedule.model";
import User from "../auth/auth.model";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

interface CreateScheduleBody {
  subject: string;
  day: string;
  startTime: string;
}

interface AssignTrainerBody {
  trainerId: string;
}

export const createSchedule = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { subject, day, startTime } = req.body as CreateScheduleBody;
    const adminId = req.user?.id;

    if (!adminId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const start = parseInt(startTime.split(":")[0]);
    const end = start + 2;
    const endTime = `${end}:00`;

    // Check if the admin has already created 5 schedules on the same day
    const scheduleCount = await Schedule.countDocuments({
      day: new Date(day),
      createdBy: adminId,
    });

    if (scheduleCount >= 5) {
      res.status(400).json({ message: "Max 5 schedules allowed per day" });
      return;
    }

    // Create the schedule without assigning a trainer
    const schedule = await Schedule.create({
      subject,
      day: new Date(day),
      startTime,
      endTime,
      createdBy: adminId,
      trainer: null, // Initially no trainer assigned
      trainees: [], // No trainees yet
    });

    res
      .status(201)
      .json({ message: "Schedule created successfully", schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const assignTrainer = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { scheduleId } = req.params;
    const { trainerId } = req.body as AssignTrainerBody;

    console.log("Received scheduleId from params:", scheduleId);
    console.log("Received trainerId from body:", trainerId);

    const schedule = await Schedule.findById(scheduleId);
    if (!schedule) {
      console.log("Schedule not found");
      res.status(404).json({ message: "Schedule not found" });
      return;
    }
    console.log("Schedule found:", schedule);

    const trainerObjectId = new mongoose.Types.ObjectId(trainerId);
    console.log("Converted trainerObjectId:", trainerObjectId);

    const trainer = await User.findById(trainerObjectId);
    if (!trainer || trainer.role !== "trainer") {
      console.log("Trainer not found or invalid role");
      res.status(404).json({ message: "Trainer not found or invalid role" });
      return;
    }
    console.log("Trainer found:", trainer);

    schedule.trainer = trainerObjectId;
    await schedule.save();

    res
      .status(200)
      .json({ message: "Trainer assigned successfully", schedule });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAdminSchedules = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const adminId = req.user?.id;

    if (!adminId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const schedules = await Schedule.find({ createdBy: adminId })
      .populate("trainer", "name email")
      .populate("trainees", "name email")
      .sort({ day: 1, startTime: 1 });

    res.status(200).json({
      message: "Schedules retrieved successfully",
      count: schedules.length,
      schedules,
    });
  } catch (err) {
    console.error("Error fetching admin schedules:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  createSchedule,
  assignTrainer,
  getAdminSchedules,
};
