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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const schedule_model_1 = __importDefault(require("../admin/schedule.model"));
class ScheduleService {
    createSchedule(scheduleData) {
        return __awaiter(this, void 0, void 0, function* () {
            const schedule = new schedule_model_1.default(scheduleData);
            return yield schedule.save();
        });
    }
    getScheduleById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield schedule_model_1.default.findById(id)
                .populate("trainerId", "name email")
                .populate("traineeId", "name email");
        });
    }
    getSchedulesByTrainer(trainerId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { trainerId };
            if (date) {
                query.date = date;
            }
            return yield schedule_model_1.default.find(query)
                .populate("traineeId", "name email")
                .sort({ date: 1, startTime: 1 });
        });
    }
    getSchedulesByTrainee(traineeId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { traineeId };
            if (date) {
                query.date = date;
            }
            return yield schedule_model_1.default.find(query)
                .populate("trainerId", "name email")
                .sort({ date: 1, startTime: 1 });
        });
    }
    updateSchedule(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield schedule_model_1.default.findByIdAndUpdate(id, updateData, {
                new: true,
            }).populate("trainerId traineeId", "name email");
        });
    }
    deleteSchedule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield schedule_model_1.default.findByIdAndDelete(id);
        });
    }
    checkScheduleConflict(trainerId, date, startTime, endTime, excludeScheduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
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
            const conflictingSchedule = yield schedule_model_1.default.findOne(query);
            return !!conflictingSchedule;
        });
    }
}
exports.ScheduleService = ScheduleService;
