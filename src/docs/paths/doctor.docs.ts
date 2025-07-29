/**
 * @swagger
 * /doctor:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     security: []  # No authentication required to view doctors
 *     parameters:
 *       - in: query
 *         name: specialization
 *         schema:
 *           type: string
 *         description: Filter doctors by specialization
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: integer
 *         description: Filter doctors by minimum years of experience
 *     responses:
 *       200:
 *         description: List of doctors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       201:
 *         description: Doctor profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Doctor'
 *       400:
 *         description: Invalid input data or doctor profile already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/v1/doctor/specialization/{specialization}:
 *   get:
 *     summary: Get doctors by specialization
 *     tags: [Doctors]
 *     security: []  # No authentication required to view doctors
 *     parameters:
 *       - in: path
 *         name: specialization
 *         required: true
 *         schema:
 *           type: string
 *         description: The specialization to filter doctors by
 *         example: "cardiology"
 *     responses:
 *       200:
 *         description: List of doctors with the specified specialization retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: No doctors found with the specified specialization
 *       500:
 *         description: Internal server error
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
 *             example:
 *               specialization: "Cardiologist"
 *               experience: 12
 *               qualifications: ["MBBS", "MD - Cardiology", "Fellowship in Interventional Cardiology"]
 *               bio: "Dr. John Smith is a board-certified cardiologist with over 12 years of experience."
 *               consultationFee: 175
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
