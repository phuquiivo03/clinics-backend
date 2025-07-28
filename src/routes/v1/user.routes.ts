import express from 'express';
import { userController } from '../../controllers/index.controller';
import { authMiddleware, checkRole } from '../../middleware/auth';
import multer from 'multer';
import { ROLE } from '../../types';
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', userController.createUser);

router.patch('/', authMiddleware, upload.single('avatar'), userController.updateUserProfile);

router.get('/profile', authMiddleware, userController.getUserProfile);

// Add route for getting all users - requires authentication
router.get('/', authMiddleware, checkRole([ROLE.ADMIN]), userController.getAllUsers);

export default router;
