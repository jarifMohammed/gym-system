import { ISchedule } from "../admin/schedule.model";
import mongoose from "mongoose";
import Schedule from "../admin/schedule.model";

export class ScheduleService {
  async createSchedule(scheduleData: Partial<ISchedule>): Promise<ISchedule> {
    const schedule = new Schedule(scheduleData);
    return await schedule.save();
  }

  async getScheduleById(id: string): Promise<ISchedule | null> {
    return await Schedule.findById(id)
      .populate("trainerId", "name email")
      .populate("traineeId", "name email");
  }

  async getSchedulesByTrainer(
    trainerId: string,
    date?: Date
  ): Promise<ISchedule[]> {
    const query: any = { trainerId };
    if (date) {
      query.date = date;
    }
    return await Schedule.find(query)
      .populate("traineeId", "name email")
      .sort({ date: 1, startTime: 1 });
  }

  async getSchedulesByTrainee(
    traineeId: string,
    date?: Date
  ): Promise<ISchedule[]> {
    const query: any = { traineeId };
    if (date) {
      query.date = date;
    }
    return await Schedule.find(query)
      .populate("trainerId", "name email")
      .sort({ date: 1, startTime: 1 });
  }

  async updateSchedule(
    id: string,
    updateData: Partial<ISchedule>
  ): Promise<ISchedule | null> {
    return await Schedule.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("trainerId traineeId", "name email");
  }

  async deleteSchedule(id: string): Promise<ISchedule | null> {
    return await Schedule.findByIdAndDelete(id);
  }

  async checkScheduleConflict(
    trainerId: string,
    date: Date,
    startTime: string,
    endTime: string,
    excludeScheduleId?: string
  ): Promise<boolean> {
    const query: any = {
      trainerId,
      date,
      status: { $ne: "cancelled" },
      $or: [
        {
          startTime: { $lte: startTime },
          endTime: { $gt: startTime },
        },
        {
          startTime: { $lt: endTime },
          endTime: { $gte: endTime },
        },
        {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime },
        },
      ],
    };

    if (excludeScheduleId) {
      query._id = { $ne: excludeScheduleId };
    }

    const conflictingSchedule = await Schedule.findOne(query);
    return !!conflictingSchedule;
  }
}
