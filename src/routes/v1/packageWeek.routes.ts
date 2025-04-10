import { Router } from 'express';
import { packageWeekController } from '../../controllers';

const router = Router();

// GET endpoints
router.get('/:id', packageWeekController.findById);
router.get('/:id/details', packageWeekController.findWithFullDetails);
router.get('/date-range/:startDate/:endDate', packageWeekController.findByDateRangeWithFullDetails);

// POST endpoints
router.post('/', packageWeekController.create);

// PUT endpoints
router.put('/:id', packageWeekController.update);

// PATCH endpoints
router.patch('/:id/add-day-package/:dayPackageId', packageWeekController.addDayPackage);

export default router;
