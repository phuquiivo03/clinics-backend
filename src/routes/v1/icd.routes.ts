import { Router } from 'express';
import icdController from '../../controllers/icd.controller';
import { authMiddleware, checkRole } from '../../middleware/auth';
import { ROLE } from '../../types';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all ICDs
router.get('/', icdController.getAllICDs);

// Search ICDs by code, title, or range
router.post('/search', icdController.searchICDs);

// Get ICD by ID
router.get('/:id', icdController.getICDById);

// Get ICD by code
router.get('/code/:code', icdController.getICDByCode);


router.use(checkRole([ROLE.ADMIN]))

// Create new ICD
router.post('/', icdController.create);

// Create multiple ICDs
router.post('/bulk', icdController.createMany);

// Update ICD
router.put('/:id', icdController.updateICD);

// Delete ICD
router.delete('/:id', icdController.deleteICD);

export default router;