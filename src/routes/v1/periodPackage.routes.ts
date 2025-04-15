import { Router } from 'express';
import { periodPackageController } from '../../controllers/index.controller';

const router = Router();

// GET endpoints
router.get('/:id', periodPackageController.findById);

// POST endpoints
router.post('/', periodPackageController.create);

// PUT endpoints
router.put('/:id', periodPackageController.update);

// PATCH endpoints
router.patch('/:id/increment-booked', periodPackageController.incrementBooked);

export default router;
