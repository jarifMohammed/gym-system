"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const schedule_controller_1 = require("./schedule.controller");
const express_validator_1 = require("express-validator");
const validate_request_1 = require("../../middleware/validate-request");
const router = (0, express_1.Router)();
const scheduleController = new schedule_controller_1.ScheduleController();
// Validation middleware
const createScheduleValidation = [
    (0, express_validator_1.body)("trainer")
        .optional()
        .isMongoId()
        .withMessage("If provided, trainer ID must be valid"),
    (0, express_validator_1.body)("trainees")
        .optional()
        .isArray()
        .withMessage("Trainees must be an array"),
    (0, express_validator_1.body)("trainees.*")
        .optional()
        .isMongoId()
        .withMessage("Each trainee ID must be valid"),
    (0, express_validator_1.body)("day").isISO8601().withMessage("Valid date is required"),
    (0, express_validator_1.body)("startTime")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Valid start time (HH:MM) is required"),
    (0, express_validator_1.body)("endTime")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Valid end time (HH:MM) is required"),
    (0, express_validator_1.body)("notes").optional().isString(),
    validate_request_1.validateRequest,
];
const updateScheduleValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Valid schedule ID is required"),
    (0, express_validator_1.body)("trainer")
        .optional()
        .isMongoId()
        .withMessage("If provided, trainer ID must be valid"),
    (0, express_validator_1.body)("trainees")
        .optional()
        .isArray()
        .withMessage("Trainees must be an array"),
    (0, express_validator_1.body)("trainees.*")
        .optional()
        .isMongoId()
        .withMessage("Each trainee ID must be valid"),
    (0, express_validator_1.body)("day").optional().isISO8601().withMessage("Valid date is required"),
    (0, express_validator_1.body)("startTime")
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Valid start time (HH:MM) is required"),
    (0, express_validator_1.body)("endTime")
        .optional()
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .withMessage("Valid end time (HH:MM) is required"),
    (0, express_validator_1.body)("notes").optional().isString(),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["scheduled", "completed", "cancelled"])
        .withMessage("Invalid status"),
    validate_request_1.validateRequest,
];
const getScheduleValidation = [
    (0, express_validator_1.param)("id").isMongoId().withMessage("Valid schedule ID is required"),
    validate_request_1.validateRequest,
];
const getTrainerSchedulesValidation = [
    (0, express_validator_1.param)("trainerId").isMongoId().withMessage("Valid trainer ID is required"),
    (0, express_validator_1.query)("date").optional().isISO8601().withMessage("Valid date is required"),
    validate_request_1.validateRequest,
];
const getTraineeSchedulesValidation = [
    (0, express_validator_1.param)("traineeId").isMongoId().withMessage("Valid trainee ID is required"),
    (0, express_validator_1.query)("date").optional().isISO8601().withMessage("Valid date is required"),
    validate_request_1.validateRequest,
];
// Routes
router.post("/", createScheduleValidation, scheduleController.createSchedule);
router.get("/:id", getScheduleValidation, scheduleController.getSchedule);
router.get("/trainer/:trainerId", getTrainerSchedulesValidation, scheduleController.getTrainerSchedules);
router.get("/trainee/:traineeId", getTraineeSchedulesValidation, scheduleController.getTraineeSchedules);
router.put("/:id", updateScheduleValidation, scheduleController.updateSchedule);
router.delete("/:id", getScheduleValidation, scheduleController.deleteSchedule);
exports.default = router;
