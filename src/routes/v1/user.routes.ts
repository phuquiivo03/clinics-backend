import express from 'express';
import { userController } from '../../controllers/index.controller';
import { authMiddleware, adminMiddleware } from '../../middleware/auth';
import { validateBody } from '../../middleware/validateBody';
import { createUserSchema } from '../../schemas';
import type { ICreateUserRequest } from '../../dto/user';
const router = express.Router();

router.post('/', userController.createUser);

router.patch('/', authMiddleware, userController.updateUserProfile);

router.get('/profile', authMiddleware, userController.getUserProfile);

export default router;
