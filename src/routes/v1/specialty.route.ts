import { Router } from 'express';
import specialtyController from '../../controllers/specialty.controller';

const router = Router();

router.post('/', specialtyController.create);
router.post('/many', specialtyController.createMany);

router.get('/', specialtyController.findAll);

router.get('/:id', specialtyController.findById);

router.put('/:id', specialtyController.update);

router.delete('/:id', specialtyController.remove);

export default router;
