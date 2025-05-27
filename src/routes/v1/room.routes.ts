import { Router } from 'express';
import { roomController } from '../../controllers/index.controller';
import { checkRole, authMiddleware } from '../../middleware/auth';
import { ROLE } from '../../types/user';

const router = Router();

// GET endpoints
router.get('/', roomController.findAll);
router.get('/:id', roomController.findById);

router.use(authMiddleware, checkRole([ROLE.ADMIN]));
// POST endpoints
router.post('/', roomController.create);
router.post('/createMany', roomController.createMany);

// PUT endpoints
router.put('/:id', roomController.update);

// DELETE endpointsiis
router.delete('/:id', roomController.delete);

export default router;
