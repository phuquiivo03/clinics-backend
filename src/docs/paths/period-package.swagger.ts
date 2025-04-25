/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePeriodPackageRequest:
 *       type: object
 *       required:
 *         - pkg
 *         - startTime
 *         - endTime
 *         - booked
 *       properties:
 *         pkg:
 *           type: string
 *           description: Package ID
 *           example: "67f344add3b06ebf726155bd"
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the period
 *           example: "2023-12-01T08:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the period
 *           example: "2023-12-01T10:00:00.000Z"
 *         booked:
 *           type: number
 *           description: Number of booked slots
 *           example: 0
 *     PeriodPackageResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             pkg:
 *               type: string
 *             booked:
 *               type: number
 *             startTime:
 *               type: string
 *               format: date-time
 *             endTime:
 *               type: string
 *               format: date-time
 *             _id:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *             __v:
 *               type: number
 *         msg:
 *           type: string
 *           example: "OK"
 *         code:
 *           type: number
 *           example: 201
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/period-package:
 *   post:
 *     summary: Create a new period package
 *     description: Creates a new period package with the specified package ID, time range, and booking status
 *     tags: [Period Package]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePeriodPackageRequest'
 *     responses:
 *       201:
 *         description: Period package created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PeriodPackageResponse'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
