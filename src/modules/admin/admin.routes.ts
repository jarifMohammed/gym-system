import { Router } from "express";
import { verifyToken } from "../../middleware/auth.middleware";
import { checkRole } from "../../middleware/role.middleware";
import adminController from "./admin.controller";

const router: Router = Router();

// Admin routes
router.post(
  "/schedule",
  verifyToken,
  checkRole("admin"),
  adminController.createSchedule
);
router.put(
  "/schedule/:scheduleId/assign-trainer",
  verifyToken,
  checkRole("admin"),
  adminController.assignTrainer
);

export default router;
