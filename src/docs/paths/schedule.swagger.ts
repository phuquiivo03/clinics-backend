/**
 * @swagger
 * components:
 *   schemas:
 *     CreateScheduleRequest:
 *       type: object
 *       required:
 *         - dayOffset
 *         - timeOffset
 *         - type
 *         - weekPeriod
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user (optional, defaults to authenticated user)
 *           example: "67e9180afb886c8bef80f7c3"
 *         dayOffset:
 *           type: number
 *           description: Day of week (0 = Monday, 6 = Sunday)
 *           example: 1
 *         timeOffset:
 *           type: number
 *           description: Time slot (0 = morning, 1 = afternoon)
 *           example: 1
 *         type:
 *           type: string
 *           enum: ['package', 'custom']
 *           description: Type of schedule
 *           example: "package"
 *         packageId:
 *           type: string
 *           description: ID of the consultation package (required if type is package)
 *           example: "6835430bd5a938c2795cdfa5"
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of service IDs (required if type is custom)
 *           example: ["65fb32a9c5844e123f6789ef", "65fb32a9c5844e123f6789eg"]
 *         weekPeriod:
 *           type: object
 *           required:
 *             - from
 *             - to
 *           properties:
 *             from:
 *               type: string
 *               format: date-time
 *               description: Start date of the week period
 *               example: "2024-04-15T00:00:00.000Z"
 *             to:
 *               type: string
 *               format: date-time
 *               description: End date of the week period
 *               example: "2024-04-21T23:59:59.999Z"
 *     UpdateScheduleRequest:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: ['pending', 'confirmed', 'cancelled', 'completed']
 *           description: Status of the schedule
 *           example: "confirmed"
 *         dayOffset:
 *           type: number
 *           description: Day of week (0 = Monday, 6 = Sunday)
 *           example: 1
 *         timeOffset:
 *           type: number
 *           description: Time slot (0 = morning, 1 = afternoon)
 *           example: 1
 *         weekPeriod:
 *           type: object
 *           properties:
 *             from:
 *               type: string
 *               format: date-time
 *               description: Start date of the week period
 *               example: "2024-04-15T00:00:00.000Z"
 *             to:
 *               type: string
 *               format: date-time
 *               description: End date of the week period
 *               example: "2024-04-21T23:59:59.999Z"
 *     ScheduleResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           $ref: '#/components/schemas/Schedule'
 *     ScheduleListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Schedule'
 *     SchedulePaginatedResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           type: object
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *             totalDocs:
 *               type: integer
 *               example: 100
 *             limit:
 *               type: integer
 *               example: 10
 *             totalPages:
 *               type: integer
 *               example: 10
 *             page:
 *               type: integer
 *               example: 1
 *             pagingCounter:
 *               type: integer
 *               example: 1
 *             hasPrevPage:
 *               type: boolean
 *               example: false
 *             hasNextPage:
 *               type: boolean
 *               example: true
 *             prevPage:
 *               type: ["integer", "null"]
 *               example: null
 *             nextPage:
 *               type: ["integer", "null"]
 *               example: 2
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         code:
 *           type: number
 */

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Create a new schedule
 *     description: Creates a new schedule appointment for the authenticated user. Creates payment records for each service automatically.
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateScheduleRequest'
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleResponse'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not found - Package or service not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /schedule/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     description: Retrieves a schedule by its ID
 *     tags: [Schedule]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *         example: "67f24f29b661fd51f526da3a"
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ScheduleResponse'
 *       404:
 *         description: Schedule not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export const schedulePaths = {
  '/schedule': {
    post: {
      tags: ['Schedule'],
      summary: 'Create a new schedule',
      description:
        'Creates a new schedule appointment for the authenticated user. Creates payment records for each service automatically.',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateScheduleRequest',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Schedule created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ScheduleResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request - Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        404: {
          description: 'Not found - Package or service not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
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
  '/schedule/many': {
    get: {
      tags: ['Schedule'],
      summary: 'Get multiple schedules with filtering options',
      description: 'Retrieves schedules based on query parameters. Requires admin or doctor role.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'options',
          schema: {
            type: 'string',
          },
          description: 'JSON string with filter, sort, and pagination options',
          example:
            '{"filter":{"status":"confirmed"},"sort":{"date":-1},"pagination":{"page":1,"limit":10}, "populateOptions": {"path": "user", "select": ["name", "email"]}}',
        },
      ],
      responses: {
        200: {
          description: 'Schedules retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SchedulePaginatedResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        403: {
          description: 'Forbidden - User does not have required role',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
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
  '/schedule/user': {
    get: {
      tags: ['Schedule'],
      summary: 'Get schedules for the current authenticated user',
      description: 'Retrieves all schedules for the currently authenticated user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Schedules retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ScheduleListResponse',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
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
  '/schedule/current-week': {
    get: {
      tags: ['Schedule'],
      summary: 'Get schedules for the current week',
      description: 'Retrieves all schedules for the current week, organized by day and time slots',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Current week schedules retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        dayOffset: {
                          type: 'integer',
                          description: 'Day of the week (0 = Monday, 6 = Sunday)',
                          example: 0,
                        },
                        data: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              timeOffset: {
                                type: 'integer',
                                description: 'Time slot index',
                                example: 0,
                              },
                              data: {
                                type: 'array',
                                items: {
                                  $ref: '#/components/schemas/Schedule',
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
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
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
  '/schedule/by-specialization': {
    get: {
      tags: ['Schedule'],
      summary: 'Get schedules by specialization',
      description:
        'Retrieves schedules filtered by specialization, date range, time slot, day of week and status',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'specialization',
          schema: {
            type: 'string',
          },
          required: true,
          description: 'Specialization ID to filter by',
          example: '65fb32a9c5844e123f6789ef',
        },
        {
          in: 'query',
          name: 'dateRange',
          schema: {
            type: 'string',
          },
          description: 'JSON string with date range in format ["YYYY-MM-DD", "YYYY-MM-DD"]',
          example: '["2024-06-10", "2024-06-16"]',
        },
        {
          in: 'query',
          name: 'timeOffset',
          schema: {
            type: 'string',
          },
          description: 'Time slot index to filter by',
          example: '0',
        },
        {
          in: 'query',
          name: 'dayOffset',
          schema: {
            type: 'string',
          },
          description: 'Day of week to filter by (0 = Monday, 6 = Sunday)',
          example: '0',
        },
        {
          in: 'query',
          name: 'status',
          schema: {
            type: 'string',
          },
          description: 'Status to filter by',
          example: 'confirmed',
        },
      ],
      responses: {
        200: {
          description: 'Schedules retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ScheduleListResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request - Invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
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
  '/schedule/{id}': {
    get: {
      tags: ['Schedule'],
      summary: 'Get schedule by ID',
      description: 'Retrieves a specific schedule by its ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Schedule ID',
          example: '67f24f29b661fd51f526da3a',
        },
      ],
      responses: {
        200: {
          description: 'Schedule retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ScheduleResponse',
              },
            },
          },
        },
        404: {
          description: 'Schedule not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
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
    patch: {
      tags: ['Schedule'],
      summary: 'Update schedule by ID',
      description: 'Updates a specific schedule. User must be the owner or have admin/doctor role.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Schedule ID',
          example: '67f24f29b661fd51f526da3a',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateScheduleRequest',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Schedule updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ScheduleResponse',
              },
            },
          },
        },
        400: {
          description: 'Bad request - Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        403: {
          description: 'Forbidden - User does not have permission to update this schedule',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        404: {
          description: 'Schedule not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
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
  '/schedule/doctor/{id}': {
    get: {
      tags: ['Schedule'],
      summary: 'Get schedule by Doctor ID',
      description:
        'Retrieves a specific schedule by its Doctor ID \n\n - **Not userid of doctor**, \n\n - Require: Admin | Doctor role',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Doctor ID',
          example: '67e9180afb886c8bef80f7c3',
        },
      ],
      responses: {
        200: {
          msg: 'OK',
          code: 200,
          data: [
            {
              _id: '686625cfde26133440bc519a',
              userId: '67f77f3369c84748d2f4df3d',
              weekPeriod: {
                from: '2025-08-11T00:00:00.000Z',
                to: '2025-08-17T23:59:59.999Z',
                _id: '686625cfde26133440bc519b',
              },
              dayOffset: 4,
              type: 'services',
              timeOffset: 0,
              status: 'confirmed',
              services: [
                {
                  service: '684d7d3c1a2b3c4d5e6f7a1d',
                  status: 'pending',
                  _id: '686625cfde26133440bc519c',
                },
              ],
              payments: {
                payments: ['686625cfde26133440bc51a0'],
                totalPrice: 500000,
                totalPaid: 500000,
                _id: '686625cfde26133440bc519d',
              },
              packageInfo: '68564f4d14037ab8fa3e2ddc',
              createdAt: '2025-07-03T06:40:15.157Z',
              updatedAt: '2025-07-03T06:40:15.293Z',
              __v: 0,
            },
          ],
        },
      },
      404: {
        description: 'Schedule not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      401: {
        description: 'Unauthorized - Invalid or missing token',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      403: {
        description: 'Forbidden - User does not have permission to update this schedule',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
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
  patch: {
    tags: ['Schedule'],
    summary: 'Update schedule by ID',
    description: 'Updates a specific schedule. User must be the owner or have admin/doctor role.',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'string',
        },
        description: 'Schedule ID',
        example: '67f24f29b661fd51f526da3a',
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/UpdateScheduleRequest',
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Schedule updated successfully',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ScheduleResponse',
            },
          },
        },
      },
      400: {
        description: 'Bad request - Invalid input data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      401: {
        description: 'Unauthorized - Invalid or missing token',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      403: {
        description: 'Forbidden - User does not have permission to update this schedule',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
          },
        },
      },
      404: {
        description: 'Schedule not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
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
};

export const ScheduleSchemas = {
  Schedule: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '67f24f29b661fd51f526da3a',
      },
      userId: {
        type: 'string',
        description: 'ID of the user who created the schedule',
        example: '67e9180afb886c8bef80f7c3',
      },
      dayOffset: {
        type: 'integer',
        description: 'Day of the week (0 = Monday, 6 = Sunday)',
        example: 1,
      },
      timeOffset: {
        type: 'integer',
        description: 'Time slot (0 = morning, 1 = afternoon)',
        example: 1,
      },
      status: {
        type: 'string',
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        description: 'Status of the schedule',
        example: 'confirmed',
      },
      type: {
        type: 'string',
        enum: ['package', 'custom'],
        description: 'Type of schedule',
        example: 'package',
      },
      packageId: {
        type: 'string',
        description: 'ID of the consultation package (if type is package)',
        example: '6835430bd5a938c2795cdfa5',
      },
      services: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            service: {
              type: 'string',
              description: 'ID of the service',
              example: '65fb32a9c5844e123f6789ef',
            },
            status: {
              type: 'string',
              enum: ['pending', 'completed', 'cancelled'],
              description: 'Status of the service',
              example: 'pending',
            },
          },
        },
        description: 'Services included in the schedule',
      },
      payments: {
        type: 'object',
        properties: {
          payments: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Payment ID',
            },
            description: 'Array of payment IDs related to this schedule',
          },
          totalPrice: {
            type: 'number',
            description: 'Total price of all services in the schedule',
            example: 150000,
          },
          totalPaid: {
            type: 'number',
            description: 'Total amount paid',
            example: 0,
          },
        },
        description: 'Payment information for this schedule',
      },
      weekPeriod: {
        type: 'object',
        properties: {
          from: {
            type: 'string',
            format: 'date-time',
            description: 'Start date of the week period',
            example: '2024-04-15T00:00:00.000Z',
          },
          to: {
            type: 'string',
            format: 'date-time',
            description: 'End date of the week period',
            example: '2024-04-21T23:59:59.999Z',
          },
        },
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'When the schedule was created',
        example: '2024-06-01T10:30:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'When the schedule was last updated',
        example: '2024-06-01T10:30:00Z',
      },
    },
  },
};
