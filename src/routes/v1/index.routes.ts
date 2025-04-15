import { Router } from 'express';
import userRouter from './user.routes';
import doctorRouter from './doctor.routes';
import authRouter from './auth.routes';
import consultationPackageRouter from './consultationPackage.routes';
import consultationServiceRouter from './consultationService.routes';
import roomRouter from './room.routes';
import scheduleRouter from './schedule.routes';
import periodPackageRouter from './periodPackage.routes';
import dayPackageRouter from './dayPackage.routes';
import packageWeekRouter from './packageWeek.routes';
import blogRouter from './blog.routes';
import promotionRouter from './promotion.routes';
const router = Router();
router.use('/user', userRouter);
router.use('/doctor', doctorRouter);
router.use('/auth', authRouter);
router.use('/consultation-package', consultationPackageRouter);
router.use('/consultation-service', consultationServiceRouter);
router.use('/room', roomRouter);
router.use('/schedule', scheduleRouter);
router.use('/period-package', periodPackageRouter);
router.use('/day-package', dayPackageRouter);
router.use('/package-week', packageWeekRouter);
router.use('/blog', blogRouter);
router.use('/promotion', promotionRouter);
export default router;
