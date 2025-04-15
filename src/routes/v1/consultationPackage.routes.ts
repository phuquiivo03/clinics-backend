import { Router } from 'express';
import { consultationPackageController } from '../../controllers/index.controller';

const router = Router();

router.get('/', consultationPackageController.findAll);
router.get('/many', consultationPackageController.findMany);
router.get('/:id', consultationPackageController.findById);
router.get('/:id/details', consultationPackageController.findByIdWithFullDetails);
router.post('/', consultationPackageController.create);
router.post('/many', consultationPackageController.createMany);
export default router;
