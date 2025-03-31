import { Router } from "express";
import userRouter from "./user.routes";
import doctorRouter from "./doctor.routes";
import authRouter from "./auth.routes";
import consultationPackageRouter from "./consultationPackage.routes";
import consultationServiceRouter from "./consultationService.routes";
const router = Router();
router.use("/user", userRouter);
router.use("/doctor", doctorRouter);
router.use("/auth", authRouter);
router.use("/consultationPackage", consultationPackageRouter);
router.use("/consultationService", consultationServiceRouter);
export default router;