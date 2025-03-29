
import express from 'express';
import { userController } from '../../controllers';
import { authMiddleware, adminMiddleware } from '../../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
// // // Protected routes
// router.get('/profile', authMiddleware, userController.getUserProfile);
// router.put('/profile', authMiddleware, userController.updateUserProfile);

// // Admin routes
// router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
// router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

export default router;
