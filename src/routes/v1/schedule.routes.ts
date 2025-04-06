import { Router } from "express";
import { scheduleController } from "../../controllers";

const router = Router();

// GET endpoints
router.get("/:id", scheduleController.findById);

// POST endpoints
router.post("/", scheduleController.create);

export default router; 