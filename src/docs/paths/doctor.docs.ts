/**
 * @swagger
 * /api/v1/doctors:
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
 */

/**
 * @swagger
 * /api/v1/doctors/{id}:
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
 * /api/v1/doctors/{id}:
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
 * /api/v1/doctors/{id}:
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
