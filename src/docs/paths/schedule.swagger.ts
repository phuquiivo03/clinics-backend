/**
 * @swagger
 * components:
 *   schemas:
 *     CreateScheduleRequest:
 *       type: object
 *       required:
 *         - userId
 *         - date
 *         - startTime
 *         - endTime
 *         - status
 *         - package_id
 *         - packagePeriodId
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user making the schedule
 *           example: "67e9180afb886c8bef80f7c3"
 *         date:
 *           type: string
 *           format: date-time
 *           description: Date of the schedule
 *           example: "2024-04-15T00:00:00.000Z"
 *         startTime:
 *           type: string
 *           description: Start time of the schedule
 *           example: "09:30"
 *         endTime:
 *           type: string
 *           description: End time of the schedule
 *           example: "10:15"
 *         status:
 *           type: string
 *           description: Status of the schedule
 *           example: "pending"
 *         package_id:
 *           type: string
 *           description: ID of the package
 *           example: "65fb32a9c5844e123f6789ef"
 *         packagePeriodId:
 *           type: string
 *           description: ID of the package period
 *           example: "67f382da58ca745bcec5f69f"
 *     ScheduleResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             userId:
 *               type: string
 *             date:
 *               type: string
 *               format: date-time
 *             start_time:
 *               type: string
 *             end_time:
 *               type: string
 *             status:
 *               type: string
 *             package_id:
 *               type: string
 *             createdAt:
 *               type: string
 *               format: date-time
 *             updatedAt:
 *               type: string
 *               format: date-time
 *             __v:
 *               type: number
 *         msg:
 *           type: string
 *           example: "OK"
 *         code:
 *           type: number
 *           example: 200
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/schedule:
 *   post:
 *     summary: Create a new schedule
 *     description: Creates a new schedule with the specified user, date, time, and package information
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/v1/schedule/{id}:
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
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['date', 'startTime', 'endTime', 'type'],
              properties: {
                date: {
                  type: 'string',
                  format: 'date',
                  description: 'Date of the schedule',
                  example: '2024-06-15',
                },
                startTime: {
                  type: 'string',
                  description: 'Start time of the schedule',
                  example: '09:30',
                },
                endTime: {
                  type: 'string',
                  description: 'End time of the schedule',
                  example: '10:15',
                },
                type: {
                  type: 'string',
                  enum: ['package', 'custom'],
                  description: 'Type of schedule',
                  example: 'package',
                },
                packageId: {
                  type: 'string',
                  description: 'ID of the consultation package (required if type is package)',
                  example: '65fb32a9c5844e123f6789ef',
                },
                services: {
                  type: 'array',
                  items: {
                    type: 'string',
                  },
                  description: 'Array of service IDs (required if type is custom)',
                  example: ['65fb32a9c5844e123f6789ef', '65fb32a9c5844e123f6789eg'],
                },
              },
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
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  data: {
                    $ref: '#/components/schemas/Schedule',
                  },
                },
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
            '{"filter":{"status":"confirmed"},"sort":{"date":-1},"pagination":{"page":1,"limit":10}}',
        },
      ],
      responses: {
        200: {
          description: 'Schedules retrieved successfully',
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
                    type: 'object',
                    properties: {
                      docs: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Schedule',
                        },
                      },
                      totalDocs: {
                        type: 'integer',
                        example: 100,
                      },
                      limit: {
                        type: 'integer',
                        example: 10,
                      },
                      totalPages: {
                        type: 'integer',
                        example: 10,
                      },
                      page: {
                        type: 'integer',
                        example: 1,
                      },
                      pagingCounter: {
                        type: 'integer',
                        example: 1,
                      },
                      hasPrevPage: {
                        type: 'boolean',
                        example: false,
                      },
                      hasNextPage: {
                        type: 'boolean',
                        example: true,
                      },
                      prevPage: {
                        type: ['integer', 'null'],
                        example: null,
                      },
                      nextPage: {
                        type: ['integer', 'null'],
                        example: 2,
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
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success',
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
      },
    },
  },
  '/schedule/current-week': {
    get: {
      tags: ['Schedule'],
      summary: 'Get schedules for the current week',
      description: 'Retrieves all schedules for the current week, organized by day and time',
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
      },
    },
  },
  '/schedule/by-specialization': {
    get: {
      tags: ['Schedule'],
      summary: 'Get schedules by specialization',
      description: 'Retrieves schedules filtered by specialization',
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
      ],
      responses: {
        200: {
          description: 'Schedules retrieved successfully',
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
                      $ref: '#/components/schemas/Schedule',
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: 'Bad request - Invalid specialization ID',
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
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  data: {
                    $ref: '#/components/schemas/Schedule',
                  },
                },
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
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'confirmed', 'cancelled', 'completed'],
                  description: 'Status of the schedule',
                  example: 'confirmed',
                },
                date: {
                  type: 'string',
                  format: 'date',
                  description: 'Date of the schedule',
                  example: '2024-06-15',
                },
                startTime: {
                  type: 'string',
                  description: 'Start time of the schedule',
                  example: '09:30',
                },
                endTime: {
                  type: 'string',
                  description: 'End time of the schedule',
                  example: '10:15',
                },
              },
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
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  data: {
                    $ref: '#/components/schemas/Schedule',
                  },
                },
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
      date: {
        type: 'string',
        format: 'date',
        description: 'Date of the schedule',
        example: '2024-06-15',
      },
      startTime: {
        type: 'string',
        description: 'Start time of the schedule',
        example: '09:30',
      },
      endTime: {
        type: 'string',
        description: 'End time of the schedule',
        example: '10:15',
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
        example: '65fb32a9c5844e123f6789ef',
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
      weekPeriod: {
        type: 'object',
        properties: {
          from: {
            type: 'string',
            format: 'date-time',
            description: 'Start date of the week period',
            example: '2024-06-10T00:00:00.000Z',
          },
          to: {
            type: 'string',
            format: 'date-time',
            description: 'End date of the week period',
            example: '2024-06-16T23:59:59.999Z',
          },
        },
      },
      dayOffset: {
        type: 'integer',
        description: 'Day of the week (0 = Monday, 6 = Sunday)',
        example: 0,
      },
      timeOffset: {
        type: 'integer',
        description: 'Time slot index',
        example: 0,
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
