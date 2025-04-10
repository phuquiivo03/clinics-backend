import { Router } from 'express';
import { authController } from '../../controllers';

const router = Router();

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/verify-otp', authController.verifyOTP);

export default router;
