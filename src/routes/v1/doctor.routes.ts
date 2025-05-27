import { Router } from 'express';
import { authMiddleware, checkRole } from '../../middleware/auth';
import { doctorController } from '../../controllers/index.controller';
import { ROLE } from '../../types/user';
const router = Router();

// Public routes

router.get('/', doctorController.getAllDoctors);
router.get('/specialization/:specialization', doctorController.findBySpecialization);

router.post('/', authMiddleware, checkRole([ROLE.ADMIN]), doctorController.createDoctorProfile);

export default router;
