import { Router } from "express";
import { consultationPackageController } from "../../controllers";

const router = Router();

router.get("/", consultationPackageController.findAll);
router.get("/:id", consultationPackageController.findById);
router.post("/", consultationPackageController.create);


export default router;