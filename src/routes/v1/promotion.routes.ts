import { Router } from 'express';
import { PromotionController } from '../../controllers/promotion.controller';
import { authMiddleware, checkRole } from '../../middleware/auth';
import { ROLE } from '../../types/user';

const router = Router();
const promotionController = new PromotionController();

// Public routes
router.get('/', promotionController.getAllPromotions.bind(promotionController));
router.get('/active', promotionController.getActivePromotions.bind(promotionController));
router.get('/:id', promotionController.getPromotionById.bind(promotionController));

// Protected routes
router.use(authMiddleware, checkRole([ROLE.ADMIN]));
router.post('/', authMiddleware, promotionController.createPromotion.bind(promotionController));
router.post(
  '/createMany',
  authMiddleware,
  promotionController.createManyPromotions.bind(promotionController),
);
router.put('/:id', authMiddleware, promotionController.updatePromotion.bind(promotionController));
router.delete(
  '/:id',
  authMiddleware,
  promotionController.deletePromotion.bind(promotionController),
);

export default router;
