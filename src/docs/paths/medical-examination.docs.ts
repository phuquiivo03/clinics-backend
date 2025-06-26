export const medicalExaminationPaths = {
  '/medical-examinations': {
    get: {
      tags: ['Medical Examination'],
      summary: 'Get medical examination results with pagination',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          required: false,
          schema: {
            type: 'integer',
            default: 1,
          },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          required: false,
          schema: {
            type: 'integer',
            default: 10,
          },
        },
        {
          name: 'options',
          in: 'query',
          description: 'JSON string with filter, sort, and other query options',
          required: false,
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
};
