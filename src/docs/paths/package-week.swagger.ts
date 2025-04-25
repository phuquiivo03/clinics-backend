/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePackageWeekRequest:
 *       type: object
 *       required:
 *         - startDate
 *         - endDate
 *         - packageDays
 *       properties:
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Start date of the package week
 *           example: "2023-05-01T08:00:00.000Z"
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: End date of the package week
 *           example: "2023-12-01T08:00:00.000Z"
 *         packageDays:
 *           type: array
 *           items:
 *             type: string
 *           description: List of package day IDs
 *           example: ["67f386c8f502dd07c6c3d810"]
 *     PackageWeekResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             startDate:
 *               type: string
 *               format: date-time
 *             endDate:
 *               type: string
 *               format: date-time
 *             packageDays:
 *               type: array
 *               items:
 *                 type: string
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
 *           example: 200
 *     PackageWeekDetailsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             startDate:
 *               type: string
 *               format: date-time
 *             endDate:
 *               type: string
 *               format: date-time
 *             packageDays:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   day_offset:
 *                     type: number
 *                   period_pkgs:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         pkg:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             title:
 *                               type: string
 *                             icon:
 *                               type: string
 *                             description:
 *                               type: string
 *                             features:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             priceOptions:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   tier:
 *                                     type: string
 *                                   price:
 *                                     type: number
 *                                   testsIncluded:
 *                                     type: number
 *                                   _id:
 *                                     type: string
 *                             tests:
 *                               type: array
 *                               items:
 *                                 type: string
 *                             maxSlotPerPeriod:
 *                               type: number
 *                             faq:
 *                               type: array
 *                             bookingOptions:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   type:
 *                                     type: string
 *                                   description:
 *                                     type: string
 *                                   actionUrl:
 *                                     type: string
 *                                   _id:
 *                                     type: string
 *                         booked:
 *                           type: number
 *                         startTime:
 *                           type: string
 *                           format: date-time
 *                         endTime:
 *                           type: string
 *                           format: date-time
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
 *           example: 200
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/package-week:
 *   post:
 *     summary: Create a new package week
 *     description: Creates a new package week with the specified start date, end date, and package days
 *     tags: [Package Week]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePackageWeekRequest'
 *     responses:
 *       201:
 *         description: Package week created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackageWeekResponse'
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
 * /api/v1/package-week/{id}:
 *   get:
 *     summary: Get package week by ID
 *     description: Retrieves a package week by its ID
 *     tags: [Package Week]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package week ID
 *     responses:
 *       200:
 *         description: Package week retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackageWeekResponse'
 *       404:
 *         description: Package week not found
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
 * /api/v1/package-week/{id}/details:
 *   get:
 *     summary: Get package week details by ID
 *     description: Retrieves detailed information about a package week including nested package information
 *     tags: [Package Week]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Package week ID
 *     responses:
 *       200:
 *         description: Package week details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackageWeekDetailsResponse'
 *       404:
 *         description: Package week not found
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
 * /api/v1/package-week/date-range/{startDate}/{endDate}:
 *   get:
 *     summary: Find package weeks by date range
 *     description: Retrieves package weeks that fall within the specified date range
 *     tags: [Package Week]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date of the range
 *         example: "2023-05-01T08:00:00.000Z"
 *       - in: path
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date of the range
 *         example: "2023-12-01T08:00:00.000Z"
 *     responses:
 *       200:
 *         description: Package weeks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackageWeekDetailsResponse'
 *       400:
 *         description: Bad request - Invalid date range
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
