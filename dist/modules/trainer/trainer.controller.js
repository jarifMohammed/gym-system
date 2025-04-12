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
exports.mySchedules = void 0;
const schedule_model_1 = __importDefault(require("../admin/schedule.model"));
const mySchedules = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const trainerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!trainerId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const schedules = yield schedule_model_1.default.find({ trainer: trainerId })
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.mySchedules = mySchedules;
exports.default = {
    mySchedules: exports.mySchedules,
};
