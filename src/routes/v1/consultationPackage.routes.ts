import { Router } from 'express';
import { consultationPackageController } from '../../controllers/index.controller';
import { authMiddleware, checkRole } from '../../middleware/auth';
import { ROLE } from '../../types/user';

const router = Router();

router.get('/', consultationPackageController.findAll);
router.get('/many', consultationPackageController.findMany);
router.get('/:id', consultationPackageController.findById);
router.get('/:id/details', consultationPackageController.findByIdWithFullDetails);
router.use(authMiddleware, checkRole([ROLE.ADMIN, ROLE.DOCTOR]));
router.post('/', consultationPackageController.create);
router.post('/many', consultationPackageController.createMany);
router.patch('/many', consultationPackageController.updateMany);
export default router;
