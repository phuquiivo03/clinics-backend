import { Router } from 'express';
import { scheduleController } from '../../controllers/index.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// GET endpoints
router.use(authMiddleware);
router.get('/:id', scheduleController.findById);
router.get('/user/:userId', scheduleController.findByUserId);

// POST endpoints
router.post('/', scheduleController.create);

export default router;
