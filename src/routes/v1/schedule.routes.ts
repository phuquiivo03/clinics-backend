import { Router } from 'express';
import { scheduleController } from '../../controllers/index.controller';
import { checkRole, authMiddleware } from '../../middleware/auth';
import { ROLE } from '../../types/user';
import { checkOwnerOrRole, ModelRelate } from '../../middleware/checkOwner';

const router = Router();

// GET endpoints
router.use(authMiddleware);
router.get('/many', checkRole([ROLE.ADMIN, ROLE.DOCTOR]), scheduleController.findMany);
router.get('/user', scheduleController.findByUserId);
router.get('/current-week', scheduleController.getCurrentWeek);
router.get('/by-specialization', scheduleController.findBySpecialization);
router.get('/:id', scheduleController.findById);
router.patch('/:id', checkOwnerOrRole(ModelRelate.SCHEDULE, 'id','userId', [ROLE.ADMIN, ROLE.DOCTOR]),scheduleController.update);
// POST endpoints
router.post('/', scheduleController.create);

export default router;
