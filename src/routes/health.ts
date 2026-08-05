import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check if the server is running
 *     description: Returns a simple message indicating that the server is up and running
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Server is up and running
 */
router.get('/', (req, res) => {
  res.send('Server is up and running');
});

export default router;
