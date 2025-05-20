import express from 'express';
import { userController } from '../../controllers/index.controller';
import { authMiddleware, adminMiddleware } from '../../middleware/auth';
import { validateBody } from '../../middleware/validateBody';
import { createUserSchema } from '../../schemas';
import type { ICreateUserRequest } from '../../dto/user';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', userController.createUser);

router.patch('/', authMiddleware, upload.single('avatar'), userController.updateUserProfile);

router.get('/profile', authMiddleware, userController.getUserProfile);

export default router;
