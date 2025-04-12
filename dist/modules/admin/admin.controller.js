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
exports.getAdminSchedules = exports.assignTrainer = exports.createSchedule = void 0;
const schedule_model_1 = __importDefault(require("./schedule.model"));
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { subject, day, startTime } = req.body;
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const start = parseInt(startTime.split(":")[0]);
        const end = start + 2;
        const endTime = `${end}:00`;
        // Check if the admin has already created 5 schedules on the same day
        const scheduleCount = yield schedule_model_1.default.countDocuments({
            day: new Date(day),
            createdBy: adminId,
        });
        if (scheduleCount >= 5) {
            res.status(400).json({ message: "Max 5 schedules allowed per day" });
            return;
        }
        // Create the schedule without assigning a trainer
        const schedule = yield schedule_model_1.default.create({
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createSchedule = createSchedule;
const assignTrainer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { scheduleId } = req.params;
        const { trainerId } = req.body;
        console.log("Received scheduleId from params:", scheduleId);
        console.log("Received trainerId from body:", trainerId);
        const schedule = yield schedule_model_1.default.findById(scheduleId);
        if (!schedule) {
            console.log("Schedule not found");
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        console.log("Schedule found:", schedule);
        const trainerObjectId = new mongoose_1.default.Types.ObjectId(trainerId);
        console.log("Converted trainerObjectId:", trainerObjectId);
        const trainer = yield auth_model_1.default.findById(trainerObjectId);
        if (!trainer || trainer.role !== "trainer") {
            console.log("Trainer not found or invalid role");
            res.status(404).json({ message: "Trainer not found or invalid role" });
            return;
        }
        console.log("Trainer found:", trainer);
        schedule.trainer = trainerObjectId;
        yield schedule.save();
        res
            .status(200)
            .json({ message: "Trainer assigned successfully", schedule });
    }
    catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.assignTrainer = assignTrainer;
const getAdminSchedules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const adminId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!adminId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const schedules = yield schedule_model_1.default.find({ createdBy: adminId })
            .populate("trainer", "name email")
            .populate("trainees", "name email")
            .sort({ day: 1, startTime: 1 });
        res.status(200).json({
            message: "Schedules retrieved successfully",
            count: schedules.length,
            schedules,
        });
    }
    catch (err) {
        console.error("Error fetching admin schedules:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAdminSchedules = getAdminSchedules;
exports.default = {
    createSchedule: exports.createSchedule,
    assignTrainer: exports.assignTrainer,
    getAdminSchedules: exports.getAdminSchedules,
};
