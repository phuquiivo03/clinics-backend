export const prescriptionPaths = {
  '/prescriptions': {
    get: {
      tags: ['Prescription'],
      summary: 'Get prescriptions with pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'options',
          in: 'query',
          description:
            'JSON string containing query options. When provided, individual parameters are ignored. Example: {"filter":{"isPaid":true,"doctor":"67e9180afb886c8bef80f7c3"},"pagination":{"page":1,"limit":5},"sort":{"createdAt":-1}}',
          required: false,
          schema: {
            type: 'string',
          },
          example: '{"filter":{"isPaid":true},"pagination":{"page":1,"limit":5}}',
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
          name: 'isPaid',
          in: 'query',
          description: 'Filter by payment status (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            enum: ['true', 'false'],
          },
        },
        {
          name: 'startDate',
          in: 'query',
          description:
            'Filter by start date (ISO format, ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            format: 'date',
          },
        },
        {
          name: 'endDate',
          in: 'query',
          description: 'Filter by end date (ISO format, ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            format: 'date',
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
        },
        {
          name: 'doctor',
          in: 'query',
          description: 'Filter by doctor ID (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
            format: 'uid',
          },
        },
        {
          name: 'diagnosis',
          in: 'query',
          description:
            'Search term to filter prescriptions by diagnosis (case-insensitive, ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'string',
          },
        },
        {
          name: 'minTotalCost',
          in: 'query',
          description: 'Minimum total cost filter (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'number',
            minimum: 0,
          },
        },
        {
          name: 'maxTotalCost',
          in: 'query',
          description: 'Maximum total cost filter (ignored if options parameter is provided)',
          required: false,
          schema: {
            type: 'number',
            minimum: 0,
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
                    type: 'object',
                    properties: {
                      docs: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Prescription',
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
      },
    },
    post: {
      tags: ['Prescription'],
      summary: 'Create a new prescription',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/PrescriptionCreate',
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
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  data: {
                    $ref: '#/components/schemas/Prescription',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  '/prescriptions/user': {
    get: {
      tags: ['Prescription'],
      summary: 'Get prescriptions for the current authenticated user',
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
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Prescription',
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
  '/prescriptions/{id}': {
    get: {
      tags: ['Prescription'],
      summary: 'Get prescription by ID',
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
                    $ref: '#/components/schemas/Prescription',
                  },
                },
              },
            },
          },
        },
      },
    },
    put: {
      tags: ['Prescription'],
      summary: 'Update prescription by ID',
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
              $ref: '#/components/schemas/PrescriptionUpdate',
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
                  status: {
                    type: 'string',
                    example: 'success',
                  },
                  data: {
                    $ref: '#/components/schemas/Prescription',
                  },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      tags: ['Prescription'],
      summary: 'Delete prescription by ID',
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
          description: 'Prescription deleted successfully',
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
                        example: 'Prescription deleted successfully',
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
  '/prescriptions/{id}/payment': {
    put: {
      tags: ['Prescription'],
      summary: 'Update prescription payment status',
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
              type: 'object',
              required: ['isPaid'],
              properties: {
                isPaid: {
                  type: 'boolean',
                  example: true,
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: 'Prescription payment status updated successfully',
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
                    $ref: '#/components/schemas/Prescription',
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
