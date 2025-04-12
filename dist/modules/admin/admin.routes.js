"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const admin_controller_1 = __importDefault(require("./admin.controller"));
const router = (0, express_1.Router)();
// Admin routes
router.post("/schedule", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)("admin"), admin_controller_1.default.createSchedule);
router.put("/schedule/:scheduleId/assign-trainer", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)("admin"), admin_controller_1.default.assignTrainer);
exports.default = router;
