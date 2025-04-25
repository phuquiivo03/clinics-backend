/**
 * @swagger
 * components:
 *   schemas:
 *     CreateScheduleRequest:
 *       type: object
 *       required:
 *         - userId
 *         - date
 *         - startTime
 *         - endTime
 *         - status
 *         - package_id
 *         - packagePeriodId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user making the schedule
 *           example: "67e9180afb886c8bef80f7c3"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the schedule
 *           example: "2024-04-15T00:00:00.000Z"
 *         startTime:
 *           type: string
 *           description: Start time of the schedule
 *           example: "09:30"
 *         endTime:
 *           type: string
 *           description: End time of the schedule
 *           example: "10:15"
 *         status:
 *           type: string
 *           description: Status of the schedule
 *           example: "pending"
 *         package_id:
 *           type: string
 *           description: ID of the package
 *           example: "65fb32a9c5844e123f6789ef"
 *         packagePeriodId:
 *           type: string
 *           description: ID of the package period
 *           example: "67f382da58ca745bcec5f69f"
 *     ScheduleResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             userId:
 *               type: string
 *             date:
 *               type: string
 *               format: date-time
 *             start_time:
 *               type: string
 *             end_time:
 *               type: string
 *             status:
 *               type: string
 *             package_id:
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
 *           example: 200
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/schedule:
 *   post:
 *     summary: Create a new schedule
 *     description: Creates a new schedule with the specified user, date, time, and package information
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateScheduleRequest'
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleResponse'
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
 * /api/v1/schedule/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     description: Retrieves a schedule by its ID
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *         example: "67f24f29b661fd51f526da3a"
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleResponse'
 *       404:
 *         description: Schedule not found
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
