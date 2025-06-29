/**
 * @swagger
 * tags:
 *   name: Prescriptions
 *   description: Prescription management endpoints
 */

/**
 * @swagger
 * /api/v1/prescription:
 *   get:
 *     summary: Get all prescriptions (Admin only)
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
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
 *         description: Number of prescriptions per page
 *     responses:
 *       200:
 *         description: List of prescriptions retrieved successfully
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
 *                     $ref: '#/components/schemas/Prescription'
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patient
 *               - medications
 *             properties:
 *               patient:
 *                 type: string
 *                 format: objectId
 *                 description: Patient ID
 *                 example: "507f1f77bcf86cd799439011"
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - dosage
 *                     - frequency
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Medication name
 *                       example: "Amoxicillin"
 *                     dosage:
 *                       type: string
 *                       description: Medication dosage
 *                       example: "500mg"
 *                     frequency:
 *                       type: string
 *                       description: How often to take the medication
 *                       example: "3 times daily"
 *                     duration:
 *                       type: string
 *                       description: Duration of treatment
 *                       example: "7 days"
 *                     instructions:
 *                       type: string
 *                       description: Additional instructions
 *                       example: "Take with food"
 *               notes:
 *                 type: string
 *                 description: Additional notes for the prescription
 *                 example: "Follow up in 1 week if symptoms persist"
 *               diagnosis:
 *                 type: string
 *                 description: Medical diagnosis
 *                 example: "Upper respiratory tract infection"
 *     responses:
 *       201:
 *         description: Prescription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Prescription'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Doctor access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/prescription/{id}:
 *   get:
 *     summary: Get prescription by ID
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Prescription ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Prescription retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Prescription'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Prescription ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               medications:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: "Amoxicillin"
 *                     dosage:
 *                       type: string
 *                       example: "500mg"
 *                     frequency:
 *                       type: string
 *                       example: "3 times daily"
 *                     duration:
 *                       type: string
 *                       example: "7 days"
 *                     instructions:
 *                       type: string
 *                       example: "Take with food"
 *               notes:
 *                 type: string
 *                 example: "Follow up in 1 week if symptoms persist"
 *               diagnosis:
 *                 type: string
 *                 example: "Upper respiratory tract infection"
 *               status:
 *                 type: string
 *                 enum: [active, completed, cancelled]
 *                 example: "active"
 *     responses:
 *       200:
 *         description: Prescription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Prescription'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Doctor access required
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete prescription
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Prescription ID
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Prescription deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Prescription deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Doctor access required
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/prescription/doctor:
 *   get:
 *     summary: Get prescriptions created by the current doctor
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
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
 *         description: Number of prescriptions per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, cancelled]
 *         description: Filter by prescription status
 *     responses:
 *       200:
 *         description: Doctor's prescriptions retrieved successfully
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
 *                     $ref: '#/components/schemas/Prescription'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 3
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Doctor access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/prescription/patient:
 *   get:
 *     summary: Get prescriptions for the current patient
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
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
 *         description: Number of prescriptions per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, completed, cancelled]
 *         description: Filter by prescription status
 *     responses:
 *       200:
 *         description: Patient's prescriptions retrieved successfully
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
 *                     $ref: '#/components/schemas/Prescription'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 10
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     pages:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/prescription/{id}/payment:
 *   put:
 *     summary: Update prescription payment status
 *     tags: [Prescriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: objectId
 *         description: Prescription ID
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, failed]
 *                 description: Payment status
 *                 example: "paid"
 *               paymentMethod:
 *                 type: string
 *                 description: Payment method used
 *                 example: "Credit Card"
 *               transactionId:
 *                 type: string
 *                 description: Payment transaction ID
 *                 example: "txn_1234567890"
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: Payment amount
 *                 example: 125.50
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Prescription'
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Prescription not found
 *       500:
 *         description: Internal server error
 */

export const prescriptionPaths = {
  '/prescription': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Get all prescriptions (Admin only)',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
          description: 'Page number for pagination',
        },
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          description: 'Number of prescriptions per page',
        },
      ],
      responses: {
        200: {
          description: 'List of prescriptions retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Prescription',
                    },
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: {
                        type: 'integer',
                        example: 50,
                      },
                      page: {
                        type: 'integer',
                        example: 1,
                      },
                      limit: {
                        type: 'integer',
                        example: 10,
                      },
                      pages: {
                        type: 'integer',
                        example: 5,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
        403: {
          description: 'Forbidden - Admin access required',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
    post: {
      tags: ['Prescriptions'],
      summary: 'Create a new prescription',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['patient', 'medications'],
              properties: {
                patient: {
                  type: 'string',
                  format: 'objectId',
                  description: 'Patient ID',
                  example: '507f1f77bcf86cd799439011',
                },
                medications: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['name', 'dosage', 'frequency'],
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Medication name',
                        example: 'Amoxicillin',
                      },
                      dosage: {
                        type: 'string',
                        description: 'Medication dosage',
                        example: '500mg',
                      },
                      frequency: {
                        type: 'string',
                        description: 'How often to take the medication',
                        example: '3 times daily',
                      },
                      duration: {
                        type: 'string',
                        description: 'Duration of treatment',
                        example: '7 days',
                      },
                      instructions: {
                        type: 'string',
                        description: 'Additional instructions',
                        example: 'Take with food',
                      },
                    },
                  },
                },
                notes: {
                  type: 'string',
                  description: 'Additional notes for the prescription',
                  example: 'Follow up in 1 week if symptoms persist',
                },
                diagnosis: {
                  type: 'string',
                  description: 'Medical diagnosis',
                  example: 'Upper respiratory tract infection',
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Prescription created successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    $ref: '#/components/schemas/Prescription',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid request data',
        },
        401: {
          description: 'Unauthorized',
        },
        403: {
          description: 'Forbidden - Doctor access required',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/prescription/{id}': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Get prescription by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'objectId',
          },
          description: 'Prescription ID',
          example: '507f1f77bcf86cd799439011',
        },
      ],
      responses: {
        200: {
          description: 'Prescription retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    $ref: '#/components/schemas/Prescription',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
        404: {
          description: 'Prescription not found',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
    put: {
      tags: ['Prescriptions'],
      summary: 'Update prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'objectId',
          },
          description: 'Prescription ID',
          example: '507f1f77bcf86cd799439011',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                medications: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        example: 'Amoxicillin',
                      },
                      dosage: {
                        type: 'string',
                        example: '500mg',
                      },
                      frequency: {
                        type: 'string',
                        example: '3 times daily',
                      },
                      duration: {
                        type: 'string',
                        example: '7 days',
                      },
                      instructions: {
                        type: 'string',
                        example: 'Take with food',
                      },
                    },
                  },
                },
                notes: {
                  type: 'string',
                  example: 'Follow up in 1 week if symptoms persist',
                },
                diagnosis: {
                  type: 'string',
                  example: 'Upper respiratory tract infection',
                },
                status: {
                  type: 'string',
                  enum: ['active', 'completed', 'cancelled'],
                  example: 'active',
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Prescription updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    $ref: '#/components/schemas/Prescription',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid request data',
        },
        401: {
          description: 'Unauthorized',
        },
        403: {
          description: 'Forbidden - Doctor access required',
        },
        404: {
          description: 'Prescription not found',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
    delete: {
      tags: ['Prescriptions'],
      summary: 'Delete prescription',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'objectId',
          },
          description: 'Prescription ID',
          example: '507f1f77bcf86cd799439011',
        },
      ],
      responses: {
        200: {
          description: 'Prescription deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  message: {
                    type: 'string',
                    example: 'Prescription deleted successfully',
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
        403: {
          description: 'Forbidden - Doctor access required',
        },
        404: {
          description: 'Prescription not found',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/prescription/doctor': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Get prescriptions created by the current doctor',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
          description: 'Page number for pagination',
        },
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          description: 'Number of prescriptions per page',
        },
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['active', 'completed', 'cancelled'],
          },
          description: 'Filter by prescription status',
        },
      ],
      responses: {
        200: {
          description: "Doctor's prescriptions retrieved successfully",
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Prescription',
                    },
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: {
                        type: 'integer',
                        example: 25,
                      },
                      page: {
                        type: 'integer',
                        example: 1,
                      },
                      limit: {
                        type: 'integer',
                        example: 10,
                      },
                      pages: {
                        type: 'integer',
                        example: 3,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
        403: {
          description: 'Forbidden - Doctor access required',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/prescription/patient': {
    get: {
      tags: ['Prescriptions'],
      summary: 'Get prescriptions for the current patient',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
          },
          description: 'Page number for pagination',
        },
        {
          name: 'limit',
          in: 'query',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10,
          },
          description: 'Number of prescriptions per page',
        },
        {
          name: 'status',
          in: 'query',
          schema: {
            type: 'string',
            enum: ['active', 'completed', 'cancelled'],
          },
          description: 'Filter by prescription status',
        },
      ],
      responses: {
        200: {
          description: "Patient's prescriptions retrieved successfully",
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Prescription',
                    },
                  },
                  pagination: {
                    type: 'object',
                    properties: {
                      total: {
                        type: 'integer',
                        example: 10,
                      },
                      page: {
                        type: 'integer',
                        example: 1,
                      },
                      limit: {
                        type: 'integer',
                        example: 10,
                      },
                      pages: {
                        type: 'integer',
                        example: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
  '/prescription/{id}/payment': {
    put: {
      tags: ['Prescriptions'],
      summary: 'Update prescription payment status',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'objectId',
          },
          description: 'Prescription ID',
          example: '507f1f77bcf86cd799439011',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['paymentStatus'],
              properties: {
                paymentStatus: {
                  type: 'string',
                  enum: ['pending', 'paid', 'failed'],
                  description: 'Payment status',
                  example: 'paid',
                },
                paymentMethod: {
                  type: 'string',
                  description: 'Payment method used',
                  example: 'Credit Card',
                },
                transactionId: {
                  type: 'string',
                  description: 'Payment transaction ID',
                  example: 'txn_1234567890',
                },
                amount: {
                  type: 'number',
                  format: 'float',
                  description: 'Payment amount',
                  example: 125.5,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Payment status updated successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true,
                  },
                  data: {
                    $ref: '#/components/schemas/Prescription',
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Invalid request data',
        },
        401: {
          description: 'Unauthorized',
        },
        404: {
          description: 'Prescription not found',
        },
        500: {
          description: 'Internal server error',
        },
      },
    },
  },
};
