import { Router } from 'express';
import { consultationServiceController } from '../../controllers';

const router = Router();
router.get('/', consultationServiceController.findAll);
router.get('/many', consultationServiceController.findMany);
router.get('/:id', consultationServiceController.findById);
router.post('/', consultationServiceController.create);
router.post('/createMany', consultationServiceController.createMany);

export default router;
