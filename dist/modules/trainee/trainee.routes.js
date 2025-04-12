"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const trainee_controller_1 = __importDefault(require("./trainee.controller"));
const router = (0, express_1.Router)();
// Trainee routes
router.post("/schedule/:scheduleId/book", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)("trainee"), trainee_controller_1.default.bookSchedule);
router.get("/profile", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)("trainee"), trainee_controller_1.default.getProfile);
router.put("/profile", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)("trainee"), trainee_controller_1.default.updateProfile);
router.delete("/schedule/:scheduleId/cancel", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)("trainee"), trainee_controller_1.default.cancelBooking);
exports.default = router;
