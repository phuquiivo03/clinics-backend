import { Router } from 'express';
import { authController } from '../../controllers/index.controller';

const router = Router();

router.post('/register', authController.registerUser);

router.post('/verify-otp', authController.verifyOTP);

router.post('/login', authController.loginUser);
export default router;
