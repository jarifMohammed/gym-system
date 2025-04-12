import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { body, param, query } from "express-validator";
import { validateRequest } from "../../middleware/validate-request";
import { verifyToken } from "../../middleware/auth.middleware";
import { checkRole } from "../../middleware/role.middleware";

const router = Router();
const scheduleController = new ScheduleController();

// Validation middleware
const createScheduleValidation = [
  body("trainer")
    .optional()
    .isMongoId()
    .withMessage("If provided, trainer ID must be valid"),
  body("trainees")
    .optional()
    .isArray()
    .withMessage("Trainees must be an array"),
  body("trainees.*")
    .optional()
    .isMongoId()
    .withMessage("Each trainee ID must be valid"),
  body("day").isISO8601().withMessage("Valid date is required"),
  body("startTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Valid start time (HH:MM) is required"),
  body("endTime")
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Valid end time (HH:MM) is required"),
  body("notes").optional().isString(),
  validateRequest,
];

const updateScheduleValidation = [
  param("id").isMongoId().withMessage("Valid schedule ID is required"),
  body("trainer")
    .optional()
    .isMongoId()
    .withMessage("If provided, trainer ID must be valid"),
  body("trainees")
    .optional()
    .isArray()
    .withMessage("Trainees must be an array"),
  body("trainees.*")
    .optional()
    .isMongoId()
    .withMessage("Each trainee ID must be valid"),
  body("day").optional().isISO8601().withMessage("Valid date is required"),
  body("startTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Valid start time (HH:MM) is required"),
  body("endTime")
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage("Valid end time (HH:MM) is required"),
  body("notes").optional().isString(),
  body("status")
    .optional()
    .isIn(["scheduled", "completed", "cancelled"])
    .withMessage("Invalid status"),
  validateRequest,
];

const getScheduleValidation = [
  param("id").isMongoId().withMessage("Valid schedule ID is required"),
  validateRequest,
];

const getTrainerSchedulesValidation = [
  param("trainerId").isMongoId().withMessage("Valid trainer ID is required"),
  query("date").optional().isISO8601().withMessage("Valid date is required"),
  validateRequest,
];

const getTraineeSchedulesValidation = [
  param("traineeId").isMongoId().withMessage("Valid trainee ID is required"),
  query("date").optional().isISO8601().withMessage("Valid date is required"),
  validateRequest,
];

// Routes
router.post(
  "/",
  verifyToken,
  checkRole("admin"),
  createScheduleValidation,
  scheduleController.createSchedule
);
router.get(
  "/:id",
  verifyToken,
  getScheduleValidation,
  scheduleController.getSchedule
);
router.get(
  "/trainer/:trainerId",
  verifyToken,
  getTrainerSchedulesValidation,
  scheduleController.getTrainerSchedules
);
router.get(
  "/trainee/:traineeId",
  verifyToken,
  getTraineeSchedulesValidation,
  scheduleController.getTraineeSchedules
);
router.put(
  "/:id",
  verifyToken,
  checkRole("admin"),
  updateScheduleValidation,
  scheduleController.updateSchedule
);
router.delete(
  "/:id",
  verifyToken,
  checkRole("admin"),
  getScheduleValidation,
  scheduleController.deleteSchedule
);

export default router;
