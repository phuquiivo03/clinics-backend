import { Router } from "express";
import { consultationPackageController } from "../../controllers";

const router = Router();

router.get("/", consultationPackageController.findAll);
router.post("/", consultationPackageController.create);


export default router;