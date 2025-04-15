/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Promotion management endpoints
 */

/**
 * @swagger
 * /api/v1/promotion:
 *   post:
 *     summary: Create a new promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - image
 *               - condition
 *               - regulation
 *               - discountType
 *               - discountValue
 *               - validFrom
 *               - validTo
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the promotion
 *                 example: "Summer Sale 2024"
 *               description:
 *                 type: string
 *                 description: The description of the promotion
 *                 example: "Get amazing discounts on all summer items"
 *               image:
 *                 type: string
 *                 description: The URL of the promotion image
 *                 example: "https://example.com/images/summer-sale.jpg"
 *               condition:
 *                 type: string
 *                 description: The conditions for the promotion
 *                 example: "Minimum purchase of $100"
 *               regulation:
 *                 type: string
 *                 description: The regulations for the promotion
 *                 example: "Cannot be combined with other promotions"
 *               discountType:
 *                 type: string
 *                 enum: [Miễn phí, percentage, price]
 *                 description: The type of discount
 *                 example: "percentage"
 *               discountValue:
 *                 type: string
 *                 description: The value of the discount
 *                 example: "20"
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the promotion
 *                 example: "2024-06-01T00:00:00Z"
 *               validTo:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the promotion
 *                 example: "2024-08-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: Promotion created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promotion'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/promotion/createMany:
 *   post:
 *     summary: Create multiple promotions
 *     tags: [Promotions]
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
 *                 - title
 *                 - description
 *                 - image
 *                 - condition
 *                 - regulation
 *                 - discountType
 *                 - discountValue
 *                 - validFrom
 *                 - validTo
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the promotion
 *                   example: "Summer Sale 2024"
 *                 description:
 *                   type: string
 *                   description: The description of the promotion
 *                   example: "Get amazing discounts on all summer items"
 *                 image:
 *                   type: string
 *                   description: The URL of the promotion image
 *                   example: "https://example.com/images/summer-sale.jpg"
 *                 condition:
 *                   type: string
 *                   description: The conditions for the promotion
 *                   example: "Minimum purchase of $100"
 *                 regulation:
 *                   type: string
 *                   description: The regulations for the promotion
 *                   example: "Cannot be combined with other promotions"
 *                 discountType:
 *                   type: string
 *                   enum: [Miễn phí, percentage, price]
 *                   description: The type of discount
 *                   example: "percentage"
 *                 discountValue:
 *                   type: string
 *                   description: The value of the discount
 *                   example: "20"
 *                 validFrom:
 *                   type: string
 *                   format: date-time
 *                   description: The start date of the promotion
 *                   example: "2024-06-01T00:00:00Z"
 *                 validTo:
 *                   type: string
 *                   format: date-time
 *                   description: The end date of the promotion
 *                   example: "2024-08-31T23:59:59Z"
 *     responses:
 *       201:
 *         description: Promotions created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/promotion/active:
 *   get:
 *     summary: Get all active promotions
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of active promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Promotion'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/promotion/{id}:
 *   get:
 *     summary: Get a promotion by ID
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the promotion
 *               description:
 *                 type: string
 *                 description: The description of the promotion
 *               image:
 *                 type: string
 *                 description: The URL of the promotion image
 *               condition:
 *                 type: string
 *                 description: The conditions for the promotion
 *               regulation:
 *                 type: string
 *                 description: The regulations for the promotion
 *               discountType:
 *                 type: string
 *                 enum: [Miễn phí, percentage, price]
 *                 description: The type of discount
 *               discountValue:
 *                 type: string
 *                 description: The value of the discount
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the promotion
 *               validTo:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the promotion
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a promotion
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Promotion ID
 *     responses:
 *       200:
 *         description: Promotion deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Promotion not found
 *       500:
 *         description: Internal server error
 */
