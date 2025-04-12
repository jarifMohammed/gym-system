import { Response } from "express";
import Schedule from "../admin/schedule.model";
import { AuthRequest } from "../../types/auth.types";

export const mySchedules = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const trainerId = req.user?.id;

    if (!trainerId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const schedules = await Schedule.find({ trainer: trainerId })
      .populate("createdBy", "name email")
      .populate("trainees", "name email")
      .sort({ day: 1, startTime: 1 });

    if (!schedules || schedules.length === 0) {
      res.status(404).json({ message: "No schedules found" });
      return;
    }

    res
      .status(200)
      .json({ message: "Schedules retrieved successfully", schedules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  mySchedules,
};
