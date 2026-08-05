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
 *     VNPayCreateRequest:
 *       type: object
 *       required:
 *         - paymentIds
 *       properties:
 *         orderId:
 *           type: string
 *           description: Unique order identifier. If not provided, will be auto-generated using current timestamp
 *           example: "ORDER-1650432789-123"
 *         orderInfo:
 *           type: string
 *           description: Order description that will appear on VNPay payment page
 *           default: "Thanh toan don hang"
 *           example: "Payment for medical consultation"
 *         paymentIds:
 *           type: array
 *           items:
 *             type: string
 *             format: objectId
 *           description: Array of payment IDs to process. The total amount will be calculated by summing all payment amounts
 *           example: ["67e9180afb886c8bef80f7c3", "67e9180afb886c8bef80f7c4"]
 *           minItems: 1
 *     VNPayCreateResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             paymentUrl:
 *               type: string
 *               description: VNPay payment URL to redirect user for payment processing
 *               example: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Version=2.1.0&vnp_Command=pay&vnp_TmnCode=DEMO&..."
 *             txnRef:
 *               type: string
 *               description: Transaction reference number used to track this payment
 *               example: "1650432789123"
 *         msg:
 *           type: string
 *           description: Response message
 *           example: "OK"
 *         code:
 *           type: number
 *           description: HTTP status code
 *           example: 200
 *     VNPayIPNResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             RspCode:
 *               type: string
 *               description: Response code from VNPay
 *               example: "00"
 *             Message:
 *               type: string
 *               description: Response message
 *               example: "Confirm Success"
 *         msg:
 *           type: string
 *           example: "OK"
 *         code:
 *           type: number
 *           example: 200
 */

/**
 * @swagger
 * /payment:
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
 * /payment/user:
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
 * /payment/{id}:
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
 * /payment/{id}/status:
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
 * /payment/status/{status}:
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

/**
 * @swagger
 * /payment/vnpay/create:
 *   post:
 *     summary: Create VNPay payment URL
 *     tags: [Payments]
 *     description: |
 *       Creates a VNPay payment URL for processing multiple payments online. This endpoint:
 *
 *       **Flow:**
 *       1. Validates the request body (paymentIds are required)
 *       2. Calculates total amount by summing all payment amounts from the database
 *       3. Stores payment tracking information in Redis (expires in 1 hour)
 *       4. Generates secure VNPay payment parameters with HMAC-SHA512 signature
 *       5. Returns a complete VNPay payment URL for user redirection
 *
 *       **Environment Variables Required:**
 *       - VNP_TMN_CODE: VNPay Terminal Code
 *       - VNP_HASH_SECRET: VNPay Hash Secret Key
 *       - VNP_URL: VNPay Payment Gateway URL
 *       - VNP_RETURN_URL: Return URL after payment completion
 *
 *       **Note:** This endpoint does not require authentication as it's designed to be called from frontend applications.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VNPayCreateRequest'
 *           examples:
 *             singlePayment:
 *               summary: Single payment
 *               description: Process a single payment
 *               value:
 *                 orderId: "ORDER-1650432789-123"
 *                 orderInfo: "Payment for medical consultation"
 *                 paymentIds: ["67e9180afb886c8bef80f7c3"]
 *             multiplePayments:
 *               summary: Multiple payments
 *               description: Process multiple payments in one transaction
 *               value:
 *                 orderId: "ORDER-1650432789-124"
 *                 orderInfo: "Payment for consultation and prescription"
 *                 paymentIds: ["67e9180afb886c8bef80f7c3", "67e9180afb886c8bef80f7c4"]
 *             autoGeneratedOrder:
 *               summary: Auto-generated order ID
 *               description: Let the system generate order ID automatically
 *               value:
 *                 orderInfo: "Payment for medical services"
 *                 paymentIds: ["67e9180afb886c8bef80f7c3"]
 *     responses:
 *       200:
 *         description: VNPay payment URL created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VNPayCreateResponse'
 *             examples:
 *               success:
 *                 summary: Successful response
 *                 value:
 *                   data:
 *                     paymentUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Version=2.1.0&vnp_Command=pay&vnp_TmnCode=DEMO&..."
 *                     txnRef: "ORDER-1650432789-123"
 *                   msg: "OK"
 *                   code: 200
 *       400:
 *         description: Invalid request body or payment IDs not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payment/vnpay/return:
 *   get:
 *     summary: VNPay payment return URL
 *     tags: [Payments]
 *     description: Handles the return from VNPay after payment processing. This endpoint redirects to the client application with payment results.
 *     parameters:
 *       - in: query
 *         name: vnp_Amount
 *         schema:
 *           type: string
 *         description: Payment amount from VNPay
 *       - in: query
 *         name: vnp_BankCode
 *         schema:
 *           type: string
 *         description: Bank code used for payment
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         description: VNPay response code (00 = success)
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         description: Transaction reference number
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *         description: Security hash for verification
 *     responses:
 *       302:
 *         description: Redirects to client application with payment result
 *       400:
 *         description: Invalid payment verification
 */

/**
 * @swagger
 * /payment/vnpay/ipn:
 *   get:
 *     summary: VNPay Instant Payment Notification (IPN)
 *     tags: [Payments]
 *     description: Webhook endpoint for VNPay to notify payment status. This endpoint verifies the payment and updates the database accordingly.
 *     parameters:
 *       - in: query
 *         name: vnp_Amount
 *         schema:
 *           type: string
 *         description: Payment amount from VNPay
 *       - in: query
 *         name: vnp_BankCode
 *         schema:
 *           type: string
 *         description: Bank code used for payment
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         description: VNPay response code (00 = success)
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         description: Transaction reference number
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *         description: Security hash for verification
 *     responses:
 *       200:
 *         description: Payment confirmation successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VNPayIPNResponse'
 *       400:
 *         description: Invalid signature or payment verification failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     RspCode:
 *                       type: string
 *                       example: "97"
 *                     Message:
 *                       type: string
 *                       example: "Invalid signature"
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
  '/payment/vnpay/create': {
    post: {
      tags: ['Payments'],
      summary: 'Create VNPay payment URL',
      description: `Creates a VNPay payment URL for processing multiple payments online. This endpoint:

      **Flow:**
      1. Validates the request body (paymentIds are required)
      2. Calculates total amount by summing all payment amounts from the database
      3. Stores payment tracking information in Redis (expires in 1 hour)
      4. Generates secure VNPay payment parameters with HMAC-SHA512 signature
      5. Returns a complete VNPay payment URL for user redirection

      **Environment Variables Required:**
      - VNP_TMN_CODE: VNPay Terminal Code
      - VNP_HASH_SECRET: VNPay Hash Secret Key
      - VNP_URL: VNPay Payment Gateway URL
      - VNP_RETURN_URL: Return URL after payment completion

      **Note:** This endpoint does not require authentication as it's designed to be called from frontend applications.`,
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/VNPayCreateRequest',
            },
            examples: {
              singlePayment: {
                summary: 'Single payment',
                description: 'Process a single payment',
                value: {
                  orderId: 'ORDER-1650432789-123',
                  orderInfo: 'Payment for medical consultation',
                  paymentIds: ['67e9180afb886c8bef80f7c3']
                }
              },
              multiplePayments: {
                summary: 'Multiple payments',
                description: 'Process multiple payments in one transaction',
                value: {
                  orderId: 'ORDER-1650432789-124',
                  orderInfo: 'Payment for consultation and prescription',
                  paymentIds: ['67e9180afb886c8bef80f7c3', '67e9180afb886c8bef80f7c4']
                }
              },
              autoGeneratedOrder: {
                summary: 'Auto-generated order ID',
                description: 'Let the system generate order ID automatically',
                value: {
                  orderInfo: 'Payment for medical services',
                  paymentIds: ['67e9180afb886c8bef80f7c3']
                }
              }
            }
          },
        },
      },
      responses: {
        200: {
          description: 'VNPay payment URL created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VNPayCreateResponse',
              },
              examples: {
                success: {
                  summary: 'Successful response',
                  value: {
                    data: {
                      paymentUrl: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Version=2.1.0&vnp_Command=pay&vnp_TmnCode=DEMO&vnp_Amount=50000000&vnp_CreateDate=20240120103000&vnp_CurrCode=VND&vnp_IpAddr=127.0.0.1&vnp_Locale=vn&vnp_OrderInfo=Payment+for+medical+consultation&vnp_OrderType=other&vnp_ReturnUrl=http%3A%2F%2Flocalhost%3A8081%2Fapi%2Fv1%2Fpayment%2Fvnpay%2Freturn&vnp_TxnRef=ORDER-1650432789-123&vnp_SecureHashType=HmacSHA512&vnp_SecureHash=abc123...',
                      txnRef: 'ORDER-1650432789-123'
                    },
                    msg: 'OK',
                    code: 200
                  }
                }
              }
            },
          },
        },
        400: {
          description: 'Invalid request body or payment IDs not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              examples: {
                validationError: {
                  summary: 'Validation error',
                  value: {
                    data: {
                      issues: [
                        {
                          code: 'too_small',
                          minimum: 1,
                          type: 'array',
                          inclusive: true,
                          exact: false,
                          message: 'At least one payment ID is required',
                          path: ['paymentIds']
                        }
                      ],
                      name: 'ZodError'
                    },
                    msg: 'Invalid Request Body',
                    code: 10001
                  }
                },
                noPaymentsFound: {
                  summary: 'No valid payments found',
                  value: {
                    data: {
                      message: 'No valid payments found for the provided payment IDs'
                    },
                    msg: 'Bad Request',
                    code: 10002
                  }
                },
                zeroAmount: {
                  summary: 'Zero total amount',
                  value: {
                    data: {
                      message: 'Total payment amount must be greater than 0'
                    },
                    msg: 'Bad Request',
                    code: 10002
                  }
                }
              }
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
  '/payment/vnpay/return': {
    get: {
      tags: ['Payments'],
      summary: 'VNPay payment return URL',
      description:
        'Handles the return from VNPay after payment processing. This endpoint redirects to the client application with payment results.',
      parameters: [
        {
          name: 'vnp_Amount',
          in: 'query',
          schema: { type: 'string' },
          description: 'Payment amount from VNPay',
        },
        {
          name: 'vnp_BankCode',
          in: 'query',
          schema: { type: 'string' },
          description: 'Bank code used for payment',
        },
        {
          name: 'vnp_ResponseCode',
          in: 'query',
          schema: { type: 'string' },
          description: 'VNPay response code (00 = success)',
        },
        {
          name: 'vnp_TxnRef',
          in: 'query',
          schema: { type: 'string' },
          description: 'Transaction reference number',
        },
        {
          name: 'vnp_SecureHash',
          in: 'query',
          schema: { type: 'string' },
          description: 'Security hash for verification',
        },
      ],
      responses: {
        302: {
          description: 'Redirects to client application with payment result',
        },
        400: {
          description: 'Invalid payment verification',
        },
      },
    },
  },
  '/payment/vnpay/ipn': {
    get: {
      tags: ['Payments'],
      summary: 'VNPay Instant Payment Notification (IPN)',
      description:
        'Webhook endpoint for VNPay to notify payment status. This endpoint verifies the payment and updates the database accordingly.',
      parameters: [
        {
          name: 'vnp_Amount',
          in: 'query',
          schema: { type: 'string' },
          description: 'Payment amount from VNPay',
        },
        {
          name: 'vnp_BankCode',
          in: 'query',
          schema: { type: 'string' },
          description: 'Bank code used for payment',
        },
        {
          name: 'vnp_ResponseCode',
          in: 'query',
          schema: { type: 'string' },
          description: 'VNPay response code (00 = success)',
        },
        {
          name: 'vnp_TxnRef',
          in: 'query',
          schema: { type: 'string' },
          description: 'Transaction reference number',
        },
        {
          name: 'vnp_SecureHash',
          in: 'query',
          schema: { type: 'string' },
          description: 'Security hash for verification',
        },
      ],
      responses: {
        200: {
          description: 'Payment confirmation successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/VNPayIPNResponse',
              },
            },
          },
        },
        400: {
          description: 'Invalid signature or payment verification failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: {
                    type: 'object',
                    properties: {
                      RspCode: {
                        type: 'string',
                        example: '97',
                      },
                      Message: {
                        type: 'string',
                        example: 'Invalid signature',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
