/**
 * @swagger
 * components:
 *   schemas:
 *     CreateWaitingMessageRequest:
 *       type: object
 *       required:
 *         - message
 *         - triggerAt
 *       properties:
 *         userId:
 *           type: string
 *           description: ID of the user who owns this message
 *           example: "67e9180afb886c8bef80f7c3"
 *         message:
 *           type: string
 *           description: The message content
 *           example: "Don't forget your appointment tomorrow!"
 *         status:
 *           type: string
 *           enum: ['pending', 'read', 'deleted']
 *           description: Status of the message (defaults to pending)
 *           example: "pending"
 *         triggerAt:
 *           type: string
 *           format: date-time
 *           description: When the message should be triggered/displayed
 *           example: "2024-06-15T09:30:00.000Z"
 *     UpdateWaitingMessageRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: ['pending', 'read', 'deleted']
 *           description: Status of the message
 *           example: "read"
 *     WaitingMessageResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           $ref: '#/components/schemas/WaitingMessage'
 *     WaitingMessageListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WaitingMessage'
 *     WaitingMessagePaginatedResponse:
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
 *                 $ref: '#/components/schemas/WaitingMessage'
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

export const waitingMessagePaths = {
  '/waiting-message': {
    post: {
      tags: ['Waiting Messages'],
      summary: 'Create a new waiting message',
      description: 'Creates a new waiting message for the authenticated user',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateWaitingMessageRequest'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Waiting message created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/WaitingMessageResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad request - Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/waiting-message/many': {
    get: {
      tags: ['Waiting Messages'],
      summary: 'Get multiple waiting messages with filtering options',
      description: 'Retrieves waiting messages based on query parameters. Requires admin or doctor role.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'query',
          name: 'options',
          schema: {
            type: 'string'
          },
          description: 'JSON string with filter, sort, and pagination options',
          example: '{"filter":{"status":"pending"},"sort":{"triggerAt":1},"pagination":{"page":1,"limit":10}}'
        }
      ],
      responses: {
        200: {
          description: 'Waiting messages retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/WaitingMessagePaginatedResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        403: {
          description: 'Forbidden - User does not have required role',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/waiting-message/user': {
    get: {
      tags: ['Waiting Messages'],
      summary: 'Get waiting messages for the current authenticated user',
      description: 'Retrieves all waiting messages for the currently authenticated user',
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: 'Waiting messages retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/WaitingMessageListResponse'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/waiting-message/{id}': {
    get: {
      tags: ['Waiting Messages'],
      summary: 'Get waiting message by ID',
      description: 'Retrieves a specific waiting message by its ID',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Waiting message ID',
          example: '65fb32a9c5844e123f6789ef'
        }
      ],
      responses: {
        200: {
          description: 'Waiting message retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/WaitingMessageResponse'
              }
            }
          }
        },
        404: {
          description: 'Waiting message not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    patch: {
      tags: ['Waiting Messages'],
      summary: 'Update waiting message status',
      description: 'Updates the status of a specific waiting message. User must be the owner or have admin/doctor role.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Waiting message ID',
          example: '65fb32a9c5844e123f6789ef'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateWaitingMessageRequest'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Waiting message updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/WaitingMessageResponse'
              }
            }
          }
        },
        400: {
          description: 'Bad request - Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        403: {
          description: 'Forbidden - User does not have permission to update this waiting message',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        404: {
          description: 'Waiting message not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    delete: {
      tags: ['Waiting Messages'],
      summary: 'Delete waiting message by ID',
      description: 'Deletes a specific waiting message. User must be the owner or have admin/doctor role.',
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          },
          description: 'Waiting message ID',
          example: '65fb32a9c5844e123f6789ef'
        }
      ],
      responses: {
        200: {
          description: 'Waiting message deleted successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'success'
                  },
                  message: {
                    type: 'string',
                    example: 'Waiting message deleted successfully'
                  }
                }
              }
            }
          }
        },
        401: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        403: {
          description: 'Forbidden - User does not have permission to delete this waiting message',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        404: {
          description: 'Waiting message not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        500: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  }
};

export const WaitingMessageSchemas = {
  WaitingMessage: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '65fb32a9c5844e123f6789ef'
      },
      userId: {
        type: 'string',
        description: 'ID of the user who owns this message',
        example: '67e9180afb886c8bef80f7c3'
      },
      message: {
        type: 'string',
        description: 'The message content',
        example: "Don't forget your appointment tomorrow!"
      },
      status: {
        type: 'string',
        enum: ['pending', 'read', 'deleted'],
        description: 'Status of the message',
        example: 'pending'
      },
      triggerAt: {
        type: 'string',
        format: 'date-time',
        description: 'When the message should be triggered/displayed',
        example: '2024-06-15T09:30:00.000Z'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'When the message was created',
        example: '2024-06-01T10:30:00Z'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'When the message was last updated',
        example: '2024-06-01T10:30:00Z'
      }
    }
  }
}; 