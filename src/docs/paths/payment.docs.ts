/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - schedule
 *         - service
 *         - method
 *         - amount
 *         - status
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: The payment ID
 *           example: "67e9180afb886c8bef80f7c3"
 *         schedule:
 *           type: string
 *           format: uuid
 *           description: The schedule ID this payment belongs to
 *           example: "67e9180afb886c8bef80f7c4"
 *         service:
 *           type: string
 *           format: uuid
 *           description: The consultation service ID this payment is for
 *           example: "67e9180afb886c8bef80f7c5"
 *         method:
 *           type: string
 *           enum: [cash, bank_transfer, vnpay, unknown]
 *           description: The payment method
 *           example: "cash"
 *         amount:
 *           type: number
 *           description: The payment amount
 *           example: 500000
 *         status:
 *           type: string
 *           enum: [pending, paid, failed]
 *           description: The payment status
 *           example: "pending"
 *         note:
 *           type: string
 *           description: Additional notes for the payment
 *           example: "Partial payment for consultation"
 *         user:
 *           type: string
 *           format: uuid
 *           description: The user ID who made the payment
 *           example: "67e9180afb886c8bef80f7c6"
 *         paymentId:
 *           type: string
 *           description: External payment reference ID
 *           example: "PAY-1650432789-123"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the payment was created
 *           example: "2023-04-01T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the payment was last updated
 *           example: "2023-04-01T10:35:00.000Z"
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Payment'
 *         msg:
 *           type: string
 *           example: "OK"
 *         code:
 *           type: number
 *           example: 200
 *     PaymentsResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Payment'
 *         pagination:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               example: 100
 *             limit:
 *               type: number
 *               example: 10
 *             page:
 *               type: number
 *               example: 1
 *             pages:
 *               type: number
 *               example: 10
 *         msg:
 *           type: string
 *           example: "OK"
 *         code:
 *           type: number
 *           example: 200
 */

/**
 * @swagger
 * /api/v1/payment:
 *   post:
 *     summary: Create a new payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - schedule
 *               - service
 *               - method
 *               - amount
 *               - status
 *             properties:
 *               schedule:
 *                 type: string
 *                 description: The schedule ID this payment belongs to
 *                 example: "67e9180afb886c8bef80f7c4"
 *               service:
 *                 type: string
 *                 description: The consultation service ID this payment is for
 *                 example: "67e9180afb886c8bef80f7c5"
 *               method:
 *                 type: string
 *                 enum: [cash, bank_transfer, vnpay, unknown]
 *                 description: The payment method
 *                 example: "cash"
 *               amount:
 *                 type: number
 *                 description: The payment amount
 *                 example: 500000
 *               status:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *                 description: The payment status
 *                 example: "pending"
 *               note:
 *                 type: string
 *                 description: Additional notes for the payment
 *                 example: "Partial payment for consultation"
 *               paymentId:
 *                 type: string
 *                 description: External payment reference ID
 *                 example: "PAY-1650432789-123"
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all payments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentsResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/payment/user:
 *   get:
 *     summary: Get payments for the authenticated user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's payments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentsResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/payment/{id}:
 *   get:
 *     summary: Get a payment by ID
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               method:
 *                 type: string
 *                 enum: [cash, bank_transfer, vnpay, unknown]
 *                 description: The payment method
 *               amount:
 *                 type: number
 *                 description: The payment amount
 *               status:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *                 description: The payment status
 *               note:
 *                 type: string
 *                 description: Additional notes for the payment
 *               paymentId:
 *                 type: string
 *                 description: External payment reference ID
 *     responses:
 *       200:
 *         description: Payment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/payment/{id}/status:
 *   put:
 *     summary: Update payment status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *                 description: The payment status
 *                 example: "paid"
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/payment/status/{status}:
 *   get:
 *     summary: Get payments by status
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, paid, failed]
 *         description: Payment status
 *     responses:
 *       200:
 *         description: List of payments with the specified status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentsResponse'
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

export const paymentPaths = {
  '/payment': {
    post: {
      tags: ['Payments'],
      summary: 'Create a new payment',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Payment',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Payment created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PaymentResponse',
              },
            },
          },
        },
      },
    },
    get: {
      tags: ['Payments'],
      summary: 'Get all payments',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'List of all payments',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PaymentsResponse',
              },
            },
          },
        },
      },
    },
  },
}; 