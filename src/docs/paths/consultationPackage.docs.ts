/**
 * @swagger
 * tags:
 *   name: Consultation Packages
 *   description: API endpoints for managing consultation packages
 */

/**
 * @swagger
 * /api/consultation-packages:
 *   get:
 *     summary: Get all consultation packages
 *     tags: [Consultation Packages]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter packages by title or description
 *     responses:
 *       200:
 *         description: List of consultation packages
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
 *                     $ref: '#/components/schemas/ConsultationPackage'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 *
 *   post:
 *     summary: Create a new consultation package
 *     tags: [Consultation Packages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - icon
 *               - title
 *               - description
 *               - features
 *               - priceOptions
 *               - tests
 *               - maxSlotPerPeriod
 *             properties:
 *               icon:
 *                 type: string
 *                 description: URL to the icon image for the package
 *               title:
 *                 type: string
 *                 description: The name of the package
 *               description:
 *                 type: string
 *                 description: Brief details about the package
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of benefits
 *               priceOptions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/PriceOption'
 *                 description: Different package tiers
 *               tests:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uid
 *                 description: List of test IDs
 *               maxSlotPerPeriod:
 *                 type: integer
 *                 minimum: 1
 *                 description: Maximum number of slots available per period
 *               faq:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/FAQItem'
 *                 description: Frequently asked questions
 *               bookingOptions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BookingOption'
 *                 description: Methods to book the package
 *     responses:
 *       201:
 *         description: Consultation package created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConsultationPackage'
 *       400:
 *         description: Invalid request data
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
 *                   example: Invalid request data
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 */

/**
 * @swagger
 * /api/consultation-packages/{id}:
 *   get:
 *     summary: Get a consultation package by ID
 *     tags: [Consultation Packages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: Consultation package ID
 *     responses:
 *       200:
 *         description: Consultation package details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConsultationPackage'
 *       404:
 *         description: Consultation package not found
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
 *                   example: Consultation package not found
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 *
 *   put:
 *     summary: Update a consultation package
 *     tags: [Consultation Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: Consultation package ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               icon:
 *                 type: string
 *                 description: URL to the icon image for the package
 *               title:
 *                 type: string
 *                 description: The name of the package
 *               description:
 *                 type: string
 *                 description: Brief details about the package
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of benefits
 *               priceOptions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/PriceOption'
 *                 description: Different package tiers
 *               tests:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uid
 *                 description: List of test IDs
 *               maxSlotPerPeriod:
 *                 type: integer
 *                 minimum: 1
 *                 description: Maximum number of slots available per period
 *               faq:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/FAQItem'
 *                 description: Frequently asked questions
 *               bookingOptions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/BookingOption'
 *                 description: Methods to book the package
 *     responses:
 *       200:
 *         description: Consultation package updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ConsultationPackage'
 *       400:
 *         description: Invalid request data
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
 *                   example: Invalid request data
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *       404:
 *         description: Consultation package not found
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
 *                   example: Consultation package not found
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 *
 *   delete:
 *     summary: Delete a consultation package
 *     tags: [Consultation Packages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uid
 *         description: Consultation package ID
 *     responses:
 *       200:
 *         description: Consultation package deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       format: uid
 *                       example: "67f2519ec765019a3fd5ec9a"
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized
 *       404:
 *         description: Consultation package not found
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
 *                   example: Consultation package not found
 *       500:
 *         description: Server error
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
 *                   example: Internal server error
 */
