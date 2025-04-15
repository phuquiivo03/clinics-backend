import { Router } from 'express';
import { BlogController } from '../../controllers/blog.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const blogController = new BlogController();

// Public routes
router.get('/', blogController.findAll.bind(blogController));
router.get('/active', blogController.findActive.bind(blogController));
router.get('/:id', blogController.findById.bind(blogController));

// Protected routes
router.post('/', authMiddleware, blogController.create.bind(blogController));
router.post('/createMany', authMiddleware, blogController.createMany.bind(blogController));

router.put('/:id', authMiddleware, blogController.update.bind(blogController));
router.delete('/:id', authMiddleware, blogController.delete.bind(blogController));
router.patch('/:id/toggle', authMiddleware, blogController.toggleStatus.bind(blogController));

export default router;
