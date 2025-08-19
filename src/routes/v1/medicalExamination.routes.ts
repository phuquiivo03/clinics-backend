import express from 'express';
import { MedicalExaminationResultController } from '../../controllers/medicalExamination.controller';
import { validateBody } from '../../middleware/validateBody';
import {
  MedicalExaminationResultCreateSchema,
  MedicalExaminationResultUpdateSchema,
} from '../../schemas/medicalExamination';
import { authMiddleware, checkRole } from '../../middleware/auth';
import { ROLE } from '../../types';

const router = express.Router();
const controller = new MedicalExaminationResultController();

router.use(authMiddleware);
router.get('/bot/user/:patientId', controller.findByPatientId)
router.post('/', validateBody(MedicalExaminationResultCreateSchema), controller.create);
router.get('/', controller.findMany);
router.get('/user', controller.findByUser);
router.get('/:id', controller.findById);
router.get('/patient/:patientId', controller.findByPatientId);
router.patch(
  '/:id',
  validateBody(MedicalExaminationResultUpdateSchema),
  checkRole([ROLE.DOCTOR]),
  controller.update,
);
router.delete('/:id', controller.delete);

export default router;
