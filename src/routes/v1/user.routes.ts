import express from 'express';
import { userController } from '../../controllers/index.controller';
import { authMiddleware, adminMiddleware } from '../../middleware/auth';

const router = express.Router();

router.post('/', userController.createUser);

router.patch('/', authMiddleware, userController.updateUserProfile);

router.get('/profile', authMiddleware, userController.getUserProfile);

export default router;
