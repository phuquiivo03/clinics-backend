import { Router } from 'express';
import { BlogController } from '../../controllers/blog.controller';
import multer from 'multer';
import { authMiddleware, checkRole } from '../../middleware/auth';
import { ROLE } from '../../types/user';
const upload = multer({ dest: 'uploads/' });
const router = Router();
const blogController = new BlogController();

// Public routes
router.get('/', blogController.findAll.bind(blogController));
router.get('/active', blogController.findActive.bind(blogController));
router.get('/search', blogController.search.bind(blogController));
router.get('/many', blogController.findMany.bind(blogController));
router.get('/:id', blogController.findById.bind(blogController));

// Protected routes
router.use(authMiddleware, checkRole([ROLE.ADMIN, ROLE.DOCTOR]));
router.post(
  '/',
  authMiddleware,
  upload.single('coverImage'),
  blogController.create.bind(blogController),
);
router.post('/createMany', authMiddleware, blogController.createMany.bind(blogController));

router.put('/:id', authMiddleware, blogController.update.bind(blogController));
router.delete('/:id', authMiddleware, blogController.delete.bind(blogController));
router.patch('/:id/toggle', authMiddleware, blogController.toggleStatus.bind(blogController));

export default router;
