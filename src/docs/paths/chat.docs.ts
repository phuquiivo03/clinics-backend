/**
 * @openapi
 * /chat:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Chat with a medical professional
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: string
 *             description: The user message to send to the medical professional
 *     responses:
 *       '200':
 *         description: Successful response with the medical professional's reply
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   type: string
 *                   description: The reply from the medical professional
 *       '400':
 *         description: Bad request - Invalid options format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: BAD_REQUEST
 *                     message:
 *                       type: string
 *                       example: "Invalid options format: Unexpected token in JSON at position 0"
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     ChatRequest:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: The user message to send to the medical professional
 *           example: "I need help with my prescription"
 */
export const chatPaths = {
  '/chat': {
    post: {
      tags: ['Chat'],
      summary: 'Chat with a medical professional',
      security: [{ bearerAuth: [] }],
      parameters: [
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ChatRequest',
            },
          },
        },
      },
      responses: {
        200: {
          content: {
                  data: {
                    type: 'object',
                    properties: {
                     reply: {
                       type: 'string',
                       description: 'The reply from the medical professional',
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
                        example: "Invalid options format: Unexpected token in JSON at position 0",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }
}
}