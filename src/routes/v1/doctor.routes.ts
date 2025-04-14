import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../../middleware/auth';
import { doctorController } from '../../controllers';
const router = Router();

// Public routes

router.get('/', doctorController.getAllDoctors);

// Uncomment when the controller method is implemented
// router.get('/:id', doctorController.getDoctorById);

// Protected routes

router.post('/', authMiddleware, adminMiddleware, doctorController.createDoctorProfile);

// Uncomment when the controller method is implemented
// router.patch('/:id', authMiddleware, adminMiddleware, doctorController.updateDoctor);
// Uncomment when the controller method is implemented
// router.delete('/:id', authMiddleware, adminMiddleware, doctorController.deleteDoctor);

export default router;
