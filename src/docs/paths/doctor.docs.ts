/**
 * @swagger
 * /doctor:
 *   get:
 *     summary: Get all doctors with advanced filtering and pagination
 *     tags: [Doctors]
 *     security: []  # No authentication required to view doctors
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *         description: |
 *           JSON string containing query options. When provided, individual parameters are ignored.
 *           Example: {"filter":{"specialization":"67e9180afb886c8bef80f7c3","experience":{"$gte":5}},"pagination":{"page":1,"limit":5},"sort":{"createdAt":-1}}
 *         example: '{"filter":{"specialization":"67e9180afb886c8bef80f7c3"},"pagination":{"page":1,"limit":5}}'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination (ignored if options parameter is provided)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page (ignored if options parameter is provided)
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *           format: uid
 *         description: Filter doctors by specialization ID (ignored if options parameter is provided)
 *         example: "67e9180afb886c8bef80f7c3"
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter doctors by minimum years of experience (ignored if options parameter is provided)
 *         example: 5
 *       - in: query
 *         name: maxExperience
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter doctors by maximum years of experience (ignored if options parameter is provided)
 *         example: 20
 *       - in: query
 *         name: minConsultationFee
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum consultation fee filter (ignored if options parameter is provided)
 *         example: 100000
 *       - in: query
 *         name: maxConsultationFee
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum consultation fee filter (ignored if options parameter is provided)
 *         example: 500000
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Minimum average rating filter (ignored if options parameter is provided)
 *         example: 4.0
 *       - in: query
 *         name: bio
 *         schema:
 *           type: string
 *         description: Search term to filter doctors by bio (case-insensitive, ignored if options parameter is provided)
 *         example: "cardiologist"
 *     responses:
 *       200:
 *         description: List of doctors retrieved successfully with pagination information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid options format. Please provide a valid JSON string.
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: number
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *               consultationFee:
 *                 type: number
 *                 minimum: 0
 *               room:
 *                 type: string
 *                 format: uid
 *                 description: Reference to the room where the doctor practices
 *             required:
 *               - specialization
 *               - experience
 *               - qualifications
 *               - consultationFee
 *               - room
 *             example:
 *               specialization: "67e8411218eb67934f9947a9"
 *               experience: 10
 *               qualifications: ["MBBS", "MD - Cardiology"]
 *               consultationFee: 150
 *               room: "666666666666666666666666"
 */

/**
 * @swagger
 * /doctor/{id}:
 *   get:
 *     summary: Get a doctor by ID
 *     tags: [Doctors]
 *     security: []  # No authentication required to view a doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: The doctor ID
 *     responses:
 *       200:
 *         description: Doctor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 */

/**
 * @swagger
 * /doctor/{id}:
 *   patch:
 *     summary: Update a doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: The doctor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *               experience:
 *                 type: integer
 *                 minimum: 0
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *               bio:
 *                 type: string
 *               consultationFee:
 *                 type: number
 *                 minimum: 0
 *               availability:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *                     slots:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           startTime:
 *                             type: string
 *                             format: time
 *                           endTime:
 *                             type: string
 *                             format: time
 *               room:
 *                 type: string
 *                 format: uid
 *                 description: Reference to the room where the doctor practices
 *             example:
 *               specialization: "Cardiologist"
 *               experience: 12
 *               qualifications: ["MBBS", "MD - Cardiology", "Fellowship in Interventional Cardiology"]
 *               bio: "Dr. John Smith is a board-certified cardiologist with over 12 years of experience."
 *               consultationFee: 175
 *               room: "666666666666666666666666"
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have required permissions
 *       404:
 *         description: Doctor not found
 */

/**
 * @swagger
 * /doctor/{id}:
 *   delete:
 *     summary: Delete a doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: The doctor ID
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Token does not have required permissions
 *       404:
 *         description: Doctor not found
 */
