/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user with password
 *     tags: [Users]
 *     security: []  # No authentication required for user creation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: The phone number of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *             example:
 *               phoneNumber: 01234567890
 *               password: Password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users with pagination and filtering
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *         description: JSON string with query options (filter, pagination, sort, etc.). If provided, other individual query parameters are ignored.
 *         example: '{"filter":{"role":"user"},"pagination":{"page":1,"limit":10},"sort":{"createdAt":-1}}'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination (used only if options is not provided)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page (used only if options is not provided)
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, normal, doctor]
 *         description: Filter users by role (used only if options is not provided)
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter users by name (case-insensitive search) (used only if options is not provided)
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *         description: Filter users by phone number (case-insensitive search) (used only if options is not provided)
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           description: Total number of users
 *                           example: 100
 *                         page:
 *                           type: integer
 *                           description: Current page number
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           description: Number of users per page
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                           example: 10
 *       400:
 *         description: Bad request - Invalid options format
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have required permissions
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 description: The email of the user
 *               gender:
 *                 type: string
 *                 description: The gender of the user
 *                 enum: [male, female, other]
 *               dateOfBirth:
 *                 type: string
 *                 description: The date of birth of the user
 *                 format: date
 *               occupation:
 *                 type: string
 *                 description: The occupation of the user
 *               address:
 *                 type: string
 *                 description: The address of the user
 *             example:
 *               name: John Doe
 *               email: john.doe@example.com
 *               password: Password123
 *               gender: male
 *               occupation: Software Engineer
 *               address: 123 Main St, City, Country
 *               dateOfBirth: 1990-05-15T00:00:00.000+00:00
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have required permissions
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have required permissions
 */
