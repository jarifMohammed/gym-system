"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const schedule_service_1 = require("./schedule.service");
const express_validator_1 = require("express-validator");
const scheduleService = new schedule_service_1.ScheduleService();
class ScheduleController {
    createSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const { trainer, trainees, day, startTime, endTime, notes } = req.body;
                // Only check for conflicts if trainer is provided
                if (trainer) {
                    const hasConflict = yield scheduleService.checkScheduleConflict(trainer, day, startTime, endTime);
                    if (hasConflict) {
                        return res.status(400).json({
                            message: "Schedule conflict detected. Please choose a different time slot.",
                        });
                    }
                }
                const schedule = yield scheduleService.createSchedule({
                    trainer,
                    trainees: trainees || [],
                    day,
                    startTime,
                    endTime,
                    notes,
                    status: "scheduled",
                });
                res.status(201).json(schedule);
            }
            catch (error) {
                res.status(500).json({ message: "Error creating schedule", error });
            }
        });
    }
    getSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedule = yield scheduleService.getScheduleById(req.params.id);
                if (!schedule) {
                    return res.status(404).json({ message: "Schedule not found" });
                }
                res.json(schedule);
            }
            catch (error) {
                res.status(500).json({ message: "Error fetching schedule", error });
            }
        });
    }
    getTrainerSchedules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { date } = req.query;
                const schedules = yield scheduleService.getSchedulesByTrainer(req.params.trainerId, date ? new Date(date) : undefined);
                res.json(schedules);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error fetching trainer schedules", error });
            }
        });
    }
    getTraineeSchedules(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { date } = req.query;
                const schedules = yield scheduleService.getSchedulesByTrainee(req.params.traineeId, date ? new Date(date) : undefined);
                res.json(schedules);
            }
            catch (error) {
                res
                    .status(500)
                    .json({ message: "Error fetching trainee schedules", error });
            }
        });
    }
    updateSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const { date, startTime, endTime } = req.body;
                // Check for schedule conflicts excluding the current schedule
                const hasConflict = yield scheduleService.checkScheduleConflict(req.body.trainerId, date, startTime, endTime, req.params.id);
                if (hasConflict) {
                    return res.status(400).json({
                        message: "Schedule conflict detected. Please choose a different time slot.",
                    });
                }
                const schedule = yield scheduleService.updateSchedule(req.params.id, req.body);
                if (!schedule) {
                    return res.status(404).json({ message: "Schedule not found" });
                }
                res.json(schedule);
            }
            catch (error) {
                res.status(500).json({ message: "Error updating schedule", error });
            }
        });
    }
    deleteSchedule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const schedule = yield scheduleService.deleteSchedule(req.params.id);
                if (!schedule) {
                    return res.status(404).json({ message: "Schedule not found" });
                }
                res.json({ message: "Schedule deleted successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Error deleting schedule", error });
            }
        });
    }
}
exports.ScheduleController = ScheduleController;
