import { Router } from 'express';
import { authMiddleware, checkRole } from '../../middleware/auth';
import { ROLE } from '../../types/user';
import waitingMessageController from '../../controllers/waitingMessage.controller';
import { checkOwnerOrRole, ModelRelate } from '../../middleware/checkOwner';

const router = Router();

// Protect all routes with authentication
router.use(authMiddleware);

// GET endpoints
router.get('/many', checkRole([ROLE.ADMIN, ROLE.DOCTOR]), waitingMessageController.findMany);
router.get('/user', waitingMessageController.findByUserId);
router.get('/:id', waitingMessageController.findById);

// POST endpoints
router.post('/', waitingMessageController.create);

// PATCH endpoints
router.patch(
  '/:id',
  checkOwnerOrRole(ModelRelate.WAITING_MESSAGE, 'id', 'userId', [ROLE.ADMIN, ROLE.DOCTOR]),
  waitingMessageController.update,
);

// DELETE endpoints
router.delete(
  '/:id',
  checkOwnerOrRole(ModelRelate.WAITING_MESSAGE, 'id', 'userId', [ROLE.ADMIN, ROLE.DOCTOR]),
  waitingMessageController.remove,
);

export default router;
