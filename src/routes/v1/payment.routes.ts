import { Router } from 'express';
import { PaymentController } from '../../controllers/payment.controller';
import { authMiddleware, checkRole } from '../../middleware/auth';
import { ROLE } from '../../types/user';

const router = Router();
const paymentController = new PaymentController();

// Protected routes for all authenticated users
router.use(authMiddleware);

// Routes for regular users
router.post('/', paymentController.createPayment.bind(paymentController));
router.get('/user', paymentController.getUserPayments.bind(paymentController));
router.get('/:id', paymentController.getPaymentById.bind(paymentController));

// Admin only routes
router.use(checkRole([ROLE.ADMIN]));
router.get('/', paymentController.getAllPayments.bind(paymentController));
router.get('/status/:status', paymentController.getPaymentsByStatus.bind(paymentController));
router.put('/:id', paymentController.updatePayment.bind(paymentController));
router.put('/:id/status', paymentController.updatePaymentStatus.bind(paymentController));
router.delete('/:id', paymentController.deletePayment.bind(paymentController));

export default router; 