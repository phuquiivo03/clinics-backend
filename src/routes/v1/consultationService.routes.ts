import { Router } from "express";
import { consultationServiceController } from "../../controllers";

const router = Router();
router.get("/", consultationServiceController.findAll);
router.post("/", consultationServiceController.create);
router.post("/createMany", consultationServiceController.createMany);

export default router;