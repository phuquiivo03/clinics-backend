import { Router } from 'express';
import medicationController from '../../controllers/medication.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all medications
router.get('/', medicationController.getAllMedications);

// Get medication by ID
router.get('/:id', medicationController.getMedicationById);

// Create new medication
router.post('/', medicationController.create);

// Update medication
router.put('/:id', medicationController.updateMedication);

// Delete medication
router.delete('/:id', medicationController.deleteMedication);

export default router;
