export const medicalExaminationPaths = {
  '/medical-examinations': {
    get: {
      tags: ['Medical Examination'],
      summary: 'Get medical examination results with pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'options',
          in: 'query',
          description:
            'JSON string containing query options. When provided, individual parameters are ignored. Example: {"filter":{"patient":"67e9180afb886c8bef80f7c3","examinationDate":"2024-01-15"},"pagination":{"page":1,"limit":5},"sort":{"createdAt":-1}}',
          required: false,
          schema: {
            type: 'string',
          },
          example:
            '{"filter":{"patient":"67e9180afb886c8bef80f7c3"},"pagination":{"page":1,"limit":5}}',
        },
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'integer',
            default: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'integer',
            default: 10,
          },
        },
        {
          name: 'patient',
          in: 'query',
          description: 'Filter by patient ID (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            format: 'uid',
          },
          example: '67e9180afb886c8bef80f7c3',
        },
        {
          name: 'examinationDate',
          in: 'query',
          description:
            'Filter by exact examination date (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            format: 'date',
          },
          example: '2024-01-15',
        },
        {
          name: 'startDate',
          in: 'query',
          description:
            'Filter by start date for created records (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            format: 'date',
          },
          example: '2024-01-01',
        },
        {
          name: 'endDate',
          in: 'query',
          description:
            'Filter by end date for created records (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            format: 'date',
          },
          example: '2024-01-31',
        },
        {
          name: 'prescription',
          in: 'query',
          description: 'Filter by prescription ID (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            format: 'uid',
          },
          example: '67e9180afb886c8bef80f7c3',
        },
        {
          name: 'hasServices',
          in: 'query',
          description:
            'Filter by presence of services - true for records with services, false for records without services (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            enum: ['true', 'false'],
          },
          example: 'true',
        },
      ],
      responses: {
        200: {
          description: 'Successful operation',
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
                          $ref: '#/components/schemas/MedicalExaminationResult',
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
        400: {
          description: 'Bad request - Invalid options format',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        example: 'BAD_REQUEST',
                      },
                      message: {
                        type: 'string',
                        example: 'Invalid options format: Unexpected token in JSON at position 0',
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
    post: {
      tags: ['Medical Examination'],
      summary: 'Create a new medical examination result',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MedicalExaminationResultCreate',
            },
          },
        },
      },
      responses: {
        201: {
          description: 'Medical examination result created successfully',
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
                    $ref: '#/components/schemas/MedicalExaminationResult',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/medical-examinations/me': {
    get: {
      tags: ['Medical Examination'],
      summary: 'Get medical examination results for the current authenticated user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Successful operation',
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
                          $ref: '#/components/schemas/MedicalExaminationResult',
                        },
                      },
                      totalDocs: {
                        type: 'integer',
                        example: 5,
                      },
                      limit: {
                        type: 'integer',
                        example: 10,
                      },
                      totalPages: {
                        type: 'integer',
                        example: 1,
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
                        example: false,
                      },
                      prevPage: {
                        type: ['integer', 'null'],
                        example: null,
                      },
                      nextPage: {
                        type: ['integer', 'null'],
                        example: null,
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
  '/medical-examinations/{id}': {
    get: {
      tags: ['Medical Examination'],
      summary: 'Get medical examination result by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Successful operation',
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
                    $ref: '#/components/schemas/MedicalExaminationResult',
                  },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ['Medical Examination'],
      summary: 'Update medical examination result by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MedicalExaminationResultUpdate',
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Medical examination result updated successfully',
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
                    $ref: '#/components/schemas/MedicalExaminationResult',
                  },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Medical Examination'],
      summary: 'Delete medical examination result by ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Medical examination result deleted successfully',
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
                      message: {
                        type: 'string',
                        example: 'Medical examination result deleted successfully',
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
  '/medical-examinations/patient/{patientId}': {
    get: {
      tags: ['Medical Examination'],
      summary: 'Get medical examination results by patient ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'Successful operation',
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
                      $ref: '#/components/schemas/MedicalExaminationResult',
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
  '/medical-examinations/followup/{id}': {
    put: {
      tags: ['Medical Examination'],
      summary: 'Add follow-up information to a medical examination result',
      description:
        'Add follow-up notes and optionally create a follow-up schedule for a medical examination result',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'Medical examination result ID',
          schema: {
            type: 'string',
            format: 'objectid',
          },
          example: '685d5daffeeba4e34e646c0a',
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MedicalExaminationAddFollowUp',
            },
            examples: {
              'complete-followup': {
                summary: 'Complete follow-up with schedule (Recommended)',
                description:
                  'Complete example matching the curl request format with notes and schedule',
                value: {
                  notes: 'Tai kham',
                  schedule: {
                    userId: '67e9180afb886c8bef80f7c3',
                    dayOffset: 1,
                    timeOffset: 1,
                    services: ['684d6b3a9f8e1d2c3b4a5e1d'],
                    weekPeriod: {
                      from: '2024-04-15T00:00:00.000Z',
                      to: '2024-04-15T00:00:00.000Z',
                    },
                  },
                },
              },
              'notes-only': {
                summary: 'Add follow-up notes only',
                description: 'Example of adding only follow-up notes without creating a schedule',
                value: {
                  notes: 'Tai kham',
                },
              },
              'schedule-only': {
                summary: 'Schedule without notes',
                description:
                  'Example of creating only a follow-up schedule without additional notes',
                value: {
                  schedule: {
                    userId: '67e9180afb886c8bef80f7c3',
                    dayOffset: 1,
                    timeOffset: 1,
                    services: ['684d6b3a9f8e1d2c3b4a5e1d'],
                    weekPeriod: {
                      from: '2024-04-15T00:00:00.000Z',
                      to: '2024-04-15T00:00:00.000Z',
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Follow-up information added successfully',
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
                    $ref: '#/components/schemas/MedicalExaminationResult',
                  },
                },
              },
              examples: {
                'notes-only': {
                  summary: 'Response with notes only',
                  value: {
                    status: 'success',
                    data: {
                      _id: '685d5daffeeba4e34e646c0a',
                      patient: '67e9180afb886c8bef80f7c3',
                      examinationDate: '2024-01-15',
                      symptoms: ['Fever', 'Cough'],
                      followUp: {
                        notes: 'Tai kham',
                      },
                    },
                  },
                },
                'complete-followup': {
                  summary: 'Response with complete follow-up and schedule created',
                  value: {
                    status: 'success',
                    data: {
                      _id: '685d5daffeeba4e34e646c0a',
                      patient: '67e9180afb886c8bef80f7c3',
                      examinationDate: '2024-01-15',
                      symptoms: ['Fever', 'Cough'],
                      followUp: {
                        notes: 'Tai kham',
                        schedule: '685d5daffeeba4e34e646c0b',
                      },
                    },
                  },
                },
                'schedule-only': {
                  summary: 'Response with schedule created (no notes)',
                  value: {
                    status: 'success',
                    data: {
                      _id: '685d5daffeeba4e34e646c0a',
                      patient: '67e9180afb886c8bef80f7c3',
                      examinationDate: '2024-01-15',
                      symptoms: ['Fever', 'Cough'],
                      followUp: {
                        schedule: '685d5daffeeba4e34e646c0b',
                      },
                    },
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
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        example: 'INVALID_REQUEST_BODY',
                      },
                      message: {
                        type: 'string',
                        example: 'Validation failed',
                      },
                      details: {
                        type: 'object',
                        description: 'Detailed validation errors',
                      },
                    },
                  },
                },
              },
              examples: {
                'validation-error': {
                  summary: 'Validation error example',
                  value: {
                    status: 'error',
                    error: {
                      code: 'INVALID_REQUEST_BODY',
                      message: 'Validation failed',
                      details: {
                        schedule: {
                          dayOffset: {
                            _errors: ['Day offset must be a non-negative integer'],
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
        404: {
          description: 'Medical examination result not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        example: 'NOT_FOUND',
                      },
                      message: {
                        type: 'string',
                        example: 'Medical examination result not found',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: {
          description: 'Unauthorized - Invalid or missing authentication token',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        example: 'UNAUTHORIZED',
                      },
                      message: {
                        type: 'string',
                        example: 'Authentication required',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'error',
                  },
                  error: {
                    type: 'object',
                    properties: {
                      code: {
                        type: 'string',
                        example: 'INTERNAL_SERVER_ERROR',
                      },
                      message: {
                        type: 'string',
                        example: 'An unexpected error occurred',
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
