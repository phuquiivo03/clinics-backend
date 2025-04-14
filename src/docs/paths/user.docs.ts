/**
 * @swagger
 * /api/v1/user:
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
 * /api/v1/user:
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
 * /api/v1/user/profile:
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
