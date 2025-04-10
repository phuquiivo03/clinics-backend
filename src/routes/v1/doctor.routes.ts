import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import { doctorController } from '../../controllers';
const router = express.Router();

// Public routes
router.get('/', doctorController.getAllDoctors);
// router.get('/:id', doctorController.getDoctorById);
// router.get('/:id/availability', doctorController.getDoctorAvailability);

// Protected routes
router.post('/', authMiddleware, doctorController.createDoctorProfile);
// router.put('/', authMiddleware, doctorController.updateDoctorProfile);
// router.post('/:id/reviews', authMiddleware, doctorController.addDoctorReview);

export default router;
