import { Router } from 'express';
import v1Router from './v1/index.routes';
import healthRouter from './health';
const router = Router();
router.get('/', (req, res) => {
  res.send('Hello, Bun + Express');
});

router.use('/v1', v1Router);
router.use('/health', healthRouter);
export default router;
