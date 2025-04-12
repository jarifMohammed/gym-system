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
exports.cancelBooking = exports.updateProfile = exports.getProfile = exports.bookSchedule = void 0;
const schedule_model_1 = __importDefault(require("../admin/schedule.model"));
const auth_model_1 = __importDefault(require("../auth/auth.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { scheduleId } = req.params;
        const traineeId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!traineeId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const schedule = yield schedule_model_1.default.findById(scheduleId);
        if (!schedule) {
            res.status(404).json({ message: "Schedule not found" });
            return;
        }
        // Check if already booked
        if (schedule.trainees.includes(new mongoose_1.default.Types.ObjectId(traineeId))) {
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
        schedule.trainees.push(new mongoose_1.default.Types.ObjectId(traineeId));
        yield schedule.save();
        res
            .status(200)
            .json({ message: "You have successfully booked the schedule" });
    }
    catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});
exports.bookSchedule = bookSchedule;
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = yield auth_model_1.default.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const updates = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        // Prevent password update from here if handled separately
        if (updates.password) {
            res.status(400).json({ message: "Password update not allowed here" });
            return;
        }
        const updatedUser = yield auth_model_1.default.findByIdAndUpdate(userId, updates, {
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
    }
    catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});
exports.updateProfile = updateProfile;
const cancelBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { scheduleId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const schedule = yield schedule_model_1.default.findById(scheduleId);
        if (!schedule) {
            res.status(404).json({
                success: false,
                message: "Schedule not found",
            });
            return;
        }
        // Check if the user is in the trainees array
        const isTrainee = schedule.trainees.some((traineeId) => traineeId.toString() === userId);
        if (!isTrainee) {
            res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this schedule",
            });
            return;
        }
        // Remove the user from the trainees array
        schedule.trainees = schedule.trainees.filter((traineeId) => traineeId.toString() !== userId);
        yield schedule.save();
        res.status(200).json({
            success: true,
            message: "You have successfully cancelled your booking for this schedule.",
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
});
exports.cancelBooking = cancelBooking;
exports.default = {
    bookSchedule: exports.bookSchedule,
    getProfile: exports.getProfile,
    updateProfile: exports.updateProfile,
    cancelBooking: exports.cancelBooking,
};
