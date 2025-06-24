import express from 'express';
import prescriptionController from '../../controllers/prescription.controller';
import { authMiddleware } from '../../middleware/auth';
// import { authMiddleware, adminMiddleware } from '../../middleware/auth';

const router = express.Router();

// All routes are protected with authMiddleware in the main server file
router.use(authMiddleware)
// Doctor routes
router.post('/', prescriptionController.create);
router.get('/doctor', prescriptionController.getDoctorPrescriptions);
router.put('/:id', prescriptionController.updatePrescription);
router.delete('/:id', prescriptionController.deletePrescription);

// Patient routes
router.get('/patient', prescriptionController.getPatientPrescriptions);

// General routes
router.get('/:id', prescriptionController.getPrescriptionById);
router.put('/:id/payment', prescriptionController.updatePaymentStatus);

// Admin routes
router.get('/', prescriptionController.getAllPrescriptions);

export default router;
