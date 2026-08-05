import { Router } from 'express';
import { authMiddleware, checkRole } from '../../middleware/auth';
import { doctorController } from '../../controllers/index.controller';
import { ROLE } from '../../types/user';
const router = Router();

// Public routes

router.get('/', doctorController.getAllDoctors);
router.get('/findOne', doctorController.findOne);
router.get('/specialization/:specialization', doctorController.findBySpecialization);
router.use(authMiddleware, checkRole([ROLE.ADMIN]));
router.post('/', doctorController.createDoctorProfile);

export default router;
