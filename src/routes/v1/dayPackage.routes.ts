import { Router } from "express";
import { dayPackageController } from "../../controllers";

const router = Router();

// GET endpoints
router.get("/:id", dayPackageController.findById);
router.get("/day-pkg/:dayPkgId", dayPackageController.findByDayPkgId);

// POST endpoints
router.post("/", dayPackageController.create);

// PUT endpoints
router.put("/:id", dayPackageController.update);

// PATCH endpoints
router.patch("/:id/add-period-package/:periodPackageId", dayPackageController.addPeriodPackage);

export default router; 