import { Router, type RequestHandler } from 'express';
import { consultationServiceController } from '../../controllers/index.controller';
import consultationServiceService from '../../services/consultationService.service';
import { adminMiddleware, authMiddleware } from '../../middleware/auth';

const router = Router();
router.get('/', consultationServiceController.findAll);
router.get('/many', consultationServiceController.findMany);
router.get('/:id', consultationServiceController.findById);
router.get('/specialization/:specialization', consultationServiceController.findBySpecialization);
router.post('/', consultationServiceController.create);
router.post('/createMany', consultationServiceController.createMany);

router.put('/many', authMiddleware, adminMiddleware, async (req, res): Promise<void> => {
  const { ids, data } = req.body;
  const updatedServices = await consultationServiceService.updateMany(ids, data);
  res.status(200).json(updatedServices);
});

export default router;
