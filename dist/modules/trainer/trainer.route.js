"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trainer_controller_1 = __importDefault(require("./trainer.controller"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const router = (0, express_1.Router)();
router.get("/my-schedules", auth_middleware_1.verifyToken, (0, role_middleware_1.checkRole)("trainer"), trainer_controller_1.default.mySchedules);
exports.default = router;
