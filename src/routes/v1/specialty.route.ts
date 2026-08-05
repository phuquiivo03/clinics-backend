import { Router } from 'express';
import specialtyController from '../../controllers/specialty.controller';
import { authMiddleware } from '../../middleware/auth';
import { checkRole } from '../../middleware/auth';
import { ROLE } from '../../types/user';

const router = Router();

router.get('/', specialtyController.findAll);

router.get('/:id', specialtyController.findById);

router.use(authMiddleware, checkRole([ROLE.ADMIN]));
router.post('/', specialtyController.create);
router.post('/many', specialtyController.createMany);

router.put('/:id', specialtyController.update);

router.delete('/:id', specialtyController.remove);

export default router;
