import { Router } from 'express';
import { dayPackageController } from '../../controllers/index.controller';
import { checkRole } from '../../middleware/auth';
import { authMiddleware } from '../../middleware/auth';
import { ROLE } from '../../types/user';

const router = Router();

// GET endpoints
router.get('/:id', dayPackageController.findById);
router.get('/day-pkg/:dayPkgId', dayPackageController.findByDayPkgId);
router.use(authMiddleware, checkRole([ROLE.ADMIN, ROLE.DOCTOR]));
// POST endpoints
router.post('/', dayPackageController.create);

// PUT endpoints
router.put('/:id', dayPackageController.update);

// PATCH endpoints
router.patch('/:id/add-period-package/:periodPackageId', dayPackageController.addPeriodPackage);

export default router;
