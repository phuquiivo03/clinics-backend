import express from 'express';
import { userController } from '../../controllers';
import { authMiddleware, adminMiddleware } from '../../middleware/auth';

const router = express.Router();

// Public routes
router.post('/', userController.createUser);
// Requires auhentication
router.get('/profile', authMiddleware, userController.getUserProfile);
export default router;
