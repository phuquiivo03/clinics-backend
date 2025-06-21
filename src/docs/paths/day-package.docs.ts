/**
 * @swagger
 * tags:
 *   name: Day Package
 *   description: Day Package management endpoints
 */

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
 *     DayPackage:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uid
 *           description: The unique identifier for the day package
 *           example: "507f1f77bcf86cd799439011"
 *         dayOffset:
 *           type: number
 *           description: Day offset for the package
 *           example: 0
 *         periodPkgs:
 *           type: array
 *           items:
 *             type: string
 *             format: uid
 *           description: List of period package references
 *           example: ["67f382da58ca745bcec5f69f"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the day package was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the day package was last updated
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

/**
 * @swagger
 * /api/v1/day-package/{id}:
 *   get:
 *     summary: Get a day package by ID
 *     description: Retrieve a specific day package by its ID
 *     tags: [Day Package]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: Day package ID
 *     responses:
 *       200:
 *         description: Day package retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DayPackage'
 *       400:
 *         description: Invalid day package ID
 *       404:
 *         description: Day package not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a day package
 *     description: Update a specific day package by its ID
 *     tags: [Day Package]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: Day package ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               day_offset:
 *                 type: number
 *                 description: Day offset for the package
 *                 example: 1
 *               period_pkgs:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of period package IDs
 *                 example: ["67f382da58ca745bcec5f69f"]
 *     responses:
 *       200:
 *         description: Day package updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DayPackage'
 *       400:
 *         description: Invalid request body or day package ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Doctor access required
 *       404:
 *         description: Day package not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/day-package/day-pkg/{dayPkgId}:
 *   get:
 *     summary: Get a day package by day package ID
 *     description: Retrieve a specific day package by its day package ID
 *     tags: [Day Package]
 *     parameters:
 *       - in: path
 *         name: dayPkgId
 *         required: true
 *         schema:
 *           type: string
 *         description: Day package identifier
 *     responses:
 *       200:
 *         description: Day package retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DayPackage'
 *       400:
 *         description: Invalid day package ID
 *       404:
 *         description: Day package not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/day-package/{id}/add-period-package/{periodPackageId}:
 *   patch:
 *     summary: Add a period package to a day package
 *     description: Add a specific period package to an existing day package
 *     tags: [Day Package]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: Day package ID
 *       - in: path
 *         name: periodPackageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: Period package ID to add
 *     responses:
 *       200:
 *         description: Period package added to day package successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DayPackage'
 *       400:
 *         description: Invalid day package or period package ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or Doctor access required
 *       404:
 *         description: Day package or period package not found
 *       500:
 *         description: Internal server error
 */
