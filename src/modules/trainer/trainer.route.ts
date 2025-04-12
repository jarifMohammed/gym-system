import { Router } from "express";
import trainerController from "./trainer.controller";
import { verifyToken } from "../../middleware/auth.middleware";
import { checkRole } from "../../middleware/role.middleware";

const router: Router = Router();

router.get(
  "/my-schedules",
  verifyToken,
  checkRole("trainer"),
  trainerController.mySchedules
);

export default router;
