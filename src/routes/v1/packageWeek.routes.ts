import { Router } from 'express';
import { packageWeekController } from '../../controllers/index.controller';
import { authMiddleware } from '../../middleware/auth';
import { checkRole } from '../../middleware/auth';
import { ROLE } from '../../types/user';

const router = Router();

// GET endpoints
router.get('/:id', packageWeekController.findById);
router.get('/:id/details', packageWeekController.findWithFullDetails);
router.get('/date-range/:startDate/:endDate', packageWeekController.findByDateRangeWithFullDetails);

router.use(authMiddleware, checkRole([ROLE.ADMIN, ROLE.DOCTOR]));
// POST endpoints
router.post('/', packageWeekController.create);

// PUT endpoints
router.put('/:id', packageWeekController.update);

// PATCH endpoints
router.patch('/:id/add-day-package/:dayPackageId', packageWeekController.addDayPackage);

export default router;
