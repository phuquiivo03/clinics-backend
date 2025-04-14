/**
 * @swagger
 * /api/v1/room:
 *  get:
 *      summary: Get all rooms
 *      description: Retrieve a list of all rooms
 *      tags: [Room]
 *      responses:
 *          200:
 *              description: Rooms retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Room'
 *                                  example: [{
 *                                      _id: "666666666666666666666666",
 *                                      name: "Room 1",
 *                                      roomNumber: 1,
 *                                      roomFloor: 1
 *                                  }]
 *                              message:
 *                                  type: string
 *                                  example: "Rooms retrieved successfully"
 *          401:
 *              description: Unauthorized
 *  post:
 *      summary: Create a new room
 *      description: Create a new room with the provided details
 *      tags: [Room]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - name
 *                          - roomNumber
 *                          - roomFloor
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Consultation Room 1"
 *                          roomNumber:
 *                              type: number
 *                              example: 101
 *                          roomFloor:
 *                              type: number
 *                              example: 1
 *      responses:
 *          201:
 *              description: Room created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  $ref: '#/components/schemas/Room'
 *                                  example: {
 *                                      _id: "666666666666666666666666",
 *                                      name: "Room 1",
 *                                      roomNumber: 1,
 *                                      roomFloor: 1
 *                                  }
 *                              message:
 *                                  type: string
 *                                  example: "Room created successfully"
 *          400:
 *              description: Invalid request body
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /api/v1/room/{id}:
 *  get:
 *      summary: Get a room by ID
 *      description: Retrieve a specific room by its ID
 *      tags: [Room]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              format: uid
 *            description: Room ID
 *      responses:
 *          200:
 *              description: Room retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  $ref: '#/components/schemas/Room'
 *                                  example: {
 *                                      _id: "666666666666666666666666",
 *                                      name: "Room 1",
 *                                      roomNumber: 1,
 *                                      roomFloor: 1
 *                                  }
 *                              message:
 *                                  type: string
 *                                  example: "Room retrieved successfully"
 *          400:
 *              description: Invalid room ID
 *          404:
 *              description: Room not found
 *  put:
 *      summary: Update a room
 *      description: Update a specific room by its ID
 *      tags: [Room]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              format: uid
 *            description: Room ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Updated Room Name"
 *                          roomNumber:
 *                              type: number
 *                              example: 102
 *                          roomFloor:
 *                              type: number
 *                              example: 2
 *      responses:
 *          200:
 *              description: Room updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  $ref: '#/components/schemas/Room'
 *                                  example: {
 *                                      _id: "666666666666666666666666",
 *                                      name: "Updated Room Name",
 *                                      roomNumber: 102,
 *                                      roomFloor: 2
 *                                  }
 *                              message:
 *                                  type: string
 *                                  example: "Room updated successfully"
 *          400:
 *              description: Invalid request body or room ID
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Admin access required
 *          404:
 *              description: Room not found
 */

/**
 * @swagger
 * /api/v1/room/createMany:
 *  post:
 *      summary: Create multiple rooms
 *      description: Create multiple rooms with the provided details
 *      tags: [Room]
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          rooms:
 *                              type: array
 *                              items:
 *                                  type: object
 *                                  required:
 *                                      - name
 *                                      - roomNumber
 *                                      - roomFloor
 *                                  properties:
 *                                      name:
 *                                          type: string
 *                                          example: "Consultation Room 1"
 *                                      roomNumber:
 *                                          type: number
 *                                          example: 101
 *                                      roomFloor:
 *                                          type: number
 *                                          example: 1
 *      responses:
 *          201:
 *              description: Rooms created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Room'
 *                                  example: [{
 *                                      _id: "666666666666666666666666",
 *                                      name: "Room 1",
 *                                      roomNumber: 1,
 *                                      roomFloor: 1
 *                                  }]
 *                              message:
 *                                  type: string
 *                                  example: "Rooms created successfully"
 *          400:
 *              description: Invalid request body
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Admin access required
 */
