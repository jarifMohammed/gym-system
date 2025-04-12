import { Request, Response } from "express";
import { ScheduleService } from "./schedule.service";
import { check, validationResult } from "express-validator";

const scheduleService = new ScheduleService();

export class ScheduleController {
  async createSchedule(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { trainer, trainees, day, startTime, endTime, notes } = req.body;

      // Only check for conflicts if trainer is provided
      if (trainer) {
        const hasConflict = await scheduleService.checkScheduleConflict(
          trainer,
          day,
          startTime,
          endTime
        );

        if (hasConflict) {
          return res.status(400).json({
            message:
              "Schedule conflict detected. Please choose a different time slot.",
          });
        }
      }

      const schedule = await scheduleService.createSchedule({
        trainer,
        trainees: trainees || [],
        day,
        startTime,
        endTime,
        notes,
        status: "scheduled",
      });

      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Error creating schedule", error });
    }
  }

  async getSchedule(req: Request, res: Response) {
    try {
      const schedule = await scheduleService.getScheduleById(req.params.id);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Error fetching schedule", error });
    }
  }

  async getTrainerSchedules(req: Request, res: Response) {
    try {
      const { date } = req.query;
      const schedules = await scheduleService.getSchedulesByTrainer(
        req.params.trainerId,
        date ? new Date(date as string) : undefined
      );
      res.json(schedules);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching trainer schedules", error });
    }
  }

  async getTraineeSchedules(req: Request, res: Response) {
    try {
      const { date } = req.query;
      const schedules = await scheduleService.getSchedulesByTrainee(
        req.params.traineeId,
        date ? new Date(date as string) : undefined
      );
      res.json(schedules);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching trainee schedules", error });
    }
  }

  async updateSchedule(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { date, startTime, endTime } = req.body;

      // Check for schedule conflicts excluding the current schedule
      const hasConflict = await scheduleService.checkScheduleConflict(
        req.body.trainerId,
        date,
        startTime,
        endTime,
        req.params.id
      );

      if (hasConflict) {
        return res.status(400).json({
          message:
            "Schedule conflict detected. Please choose a different time slot.",
        });
      }

      const schedule = await scheduleService.updateSchedule(
        req.params.id,
        req.body
      );
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Error updating schedule", error });
    }
  }

  async deleteSchedule(req: Request, res: Response) {
    try {
      const schedule = await scheduleService.deleteSchedule(req.params.id);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting schedule", error });
    }
  }
}
