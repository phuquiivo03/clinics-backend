/**
 * @swagger
 * components:
 *   schemas:
 *     CreateDayPackageRequest:
 *       type: object
 *       required:
 *         - day_offset
 *         - period_pkgs
 *       properties:
 *         day_offset:
 *           type: number
 *           description: Day offset for the package
 *           example: 0
 *         period_pkgs:
 *           type: array
 *           items:
 *             type: string
 *           description: List of period package IDs
 *           example: ["67f382da58ca745bcec5f69f"]
 *     DayPackageResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             day_offset:
 *               type: number
 *             period_pkgs:
 *               type: array
 *               items:
 *                 type: string
 *             _id:
 *               type: string
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
 * /api/v1/day-package:
 *   post:
 *     summary: Create a new day package
 *     description: Creates a new day package with the specified day offset and period packages
 *     tags: [Day Package]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDayPackageRequest'
 *     responses:
 *       201:
 *         description: Day package created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DayPackageResponse'
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
