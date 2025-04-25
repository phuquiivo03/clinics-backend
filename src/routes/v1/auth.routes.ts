import { Router } from 'express';
import { authController } from '../../controllers/index.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.post('/register', authController.registerUser);

router.post('/verify-otp', authController.verifyOTP);

router.post('/login', authController.loginUser);
router.use(authMiddleware);
router.post('/logout', authController.logoutUser);

router.post('/refresh-token', authController.refreshToken);

export default router;
