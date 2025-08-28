import { Router } from 'express';
import medicineController from '../../controllers/medicine.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all medicines
router.get('/', medicineController.getAllMedicines);

// Get medicine by ID
router.get('/:id', medicineController.getMedicineById);

// Create new medicine
router.post('/', medicineController.create);

// Update medicine
router.put('/:id', medicineController.updateMedicine);

// Delete medicine
router.delete('/:id', medicineController.deleteMedicine);

export default router;
