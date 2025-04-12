import { Router } from "express";
import { verifyToken } from "../../middleware/auth.middleware";
import { checkRole } from "../../middleware/role.middleware";
import traineeController from "./trainee.controller";

const router: Router = Router();

// Trainee routes
router.post(
  "/schedule/:scheduleId/book",
  verifyToken,
  checkRole("trainee"),
  traineeController.bookSchedule
);
router.get(
  "/profile",
  verifyToken,
  checkRole("trainee"),
  traineeController.getProfile
);
router.put(
  "/profile",
  verifyToken,
  checkRole("trainee"),
  traineeController.updateProfile
);
router.delete(
  "/schedule/:scheduleId/cancel",
  verifyToken,
  checkRole("trainee"),
  traineeController.cancelBooking
);

export default router;
