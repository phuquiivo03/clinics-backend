/**
 * @swagger
 * /api/v1/specialties:
 *   post:
 *     summary: Create a new specialty
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the specialty
 *               description:
 *                 type: string
 *                 description: The description of the specialty
 *     responses:
 *       201:
 *         description: Specialty created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Specialty with this name already exists
 */

/**
 * @swagger
 * /api/v1/specialties/many:
 *   post:
 *     summary: Create multiple specialties
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - name
 *                 - description
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *     responses:
 *       201:
 *         description: Specialties created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Specialty'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/specialties:
 *   get:
 *     summary: Get all specialties
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all specialties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Specialty'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/specialties/{id}:
 *   get:
 *     summary: Get a specialty by ID
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The specialty ID
 *     responses:
 *       200:
 *         description: Specialty details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Specialty not found
 */

/**
 * @swagger
 * /api/v1/specialties/{id}:
 *   put:
 *     summary: Update a specialty
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The specialty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The new name of the specialty
 *               description:
 *                 type: string
 *                 description: The new description of the specialty
 *     responses:
 *       200:
 *         description: Specialty updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Specialty'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Specialty not found
 *       409:
 *         description: Specialty with this name already exists
 */

/**
 * @swagger
 * /api/v1/specialties/{id}:
 *   delete:
 *     summary: Delete a specialty
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The specialty ID
 *     responses:
 *       200:
 *         description: Specialty deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Specialty not found
 */
