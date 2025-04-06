import { Router } from "express";
import userRouter from "./user.routes";
import doctorRouter from "./doctor.routes";
import authRouter from "./auth.routes";
import consultationPackageRouter from "./consultationPackage.routes";
import consultationServiceRouter from "./consultationService.routes";
import roomRouter from "./room.routes";
import scheduleRouter from "./schedule.routes";

const router = Router();
router.use("/user", userRouter);
router.use("/doctor", doctorRouter);
router.use("/auth", authRouter);
router.use("/consultationPackage", consultationPackageRouter);
router.use("/consultationService", consultationServiceRouter);
router.use("/room", roomRouter);
router.use("/schedule", scheduleRouter);

export default router;