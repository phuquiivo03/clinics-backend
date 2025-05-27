import { Router } from 'express';
import { scheduleController } from '../../controllers/index.controller';
import { checkRole, authMiddleware } from '../../middleware/auth';
import { ROLE } from '../../types/user';

const router = Router();

// GET endpoints
router.use(authMiddleware);
router.get('/many', checkRole([ROLE.ADMIN, ROLE.DOCTOR]), scheduleController.findMany);
router.get('/user/:userId', scheduleController.findByUserId);
router.get('/current-week', scheduleController.getCurrentWeek);
router.get('/:id', scheduleController.findById);
// POST endpoints
router.post('/', scheduleController.create);

export default router;
