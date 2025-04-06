import { Router } from "express";
import { roomController } from "../../controllers";

const router = Router();

// GET endpoints
router.get("/", roomController.findAll);
router.get("/:id", roomController.findById);

// POST endpoints
router.post("/", roomController.create);
router.post("/createMany", roomController.createMany);

// PUT endpoints
router.put("/:id", roomController.update);

// DELETE endpoints
router.delete("/:id", roomController.delete);

export default router; 