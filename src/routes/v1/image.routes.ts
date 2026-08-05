import { Router } from 'express';
import multer from 'multer';
import imageController from '../../controllers/image.controller';
import { authMiddleware } from '../../middleware/auth';

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.post('/', authMiddleware, upload.single('image'), imageController.create);

export default router;
