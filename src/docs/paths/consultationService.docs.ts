/**
 * @swagger
 * /consultation-service:
 *  get:
 *      summary: Get all consultation services
 *      description: Retrieve a list of all consultation services
 *      tags: [Consultation Service]
 *      responses:
 *          200:
 *              description: Consultation services retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/ConsultationService'
 *                                  example: [{
 *                                      _id: "666666666666666666666666",
 *                                      name: "Consultation Service 1",
 *                                      description: "Consultation Service 1 Description",
 *                                      duration: 30,
 *                                      room: "666666666666666666666666",
 *                                      doctor: "666666666666666666666666",
 *                                      price: 100,
 *                                      specialization: "666666666666666666666666"
 *                                  }]
 *                              message:
 *                                  type: string
 *                                  example: "Consultation services retrieved successfully"
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Admin access required
 *  post:
 *      summary: Create a new consultation service
 *      description: Create a new consultation service with the provided details
 *      tags: [Consultation Service]
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
 *                          - description
 *                          - duration
 *                          - room
 *                          - doctor
 *                          - price
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Điện Giải Đồ (Na + K + Cl)"
 *                          description:
 *                              type: string
 *                              example: "Chất điện giải là các khoáng chất giúp kiểm soát lượng dịch và sự cân bằng của axit và bazơ trong cơ thể. Xét nghiệm điện giải đồ bao gồm: – Natri (Na): giúp kiểm soát lượng dịch trong cơ thể, đảm bảo hoạt động của các dây thần kinh và cơ bắp. – Clorua (Cl): cũng giúp kiểm soát lượng dịch trong cơ thể, điều hòa thể tích máu và huyết áp. – Kali (K): đảm bảo sự hoạt động bình thường của tim và cơ."
 *                          duration:
 *                              type: integer
 *                              minimum: 1
 *                              example: 30
 *                          room:
 *                              type: string
 *                              format: uid
 *                              example: "67f2519ec765019a3fd5ec9a"
 *                          doctor:
 *                              type: string
 *                              format: uid
 *                              example: "67e9180afb886c8bef80f7c3"
 *                          price:
 *                              type: number
 *                              minimum: 0
 *                              example: 78000
 *                          specialization:
 *                              type: string
 *                              format: uid
 *                              example: "67e9180afb886c8bef80f7c3"
 *      responses:
 *          201:
 *              description: Consultation service created successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  $ref: '#/components/schemas/ConsultationService'
 *                                  example: {
 *                                      _id: "666666666666666666666666",
 *                                      name: "Điện Giải Đồ (Na + K + Cl)",
 *                                      description: "Chất điện giải là các khoáng chất giúp kiểm soát lượng dịch và sự cân bằng của axit và bazơ trong cơ thể. Xét nghiệm điện giải đồ bao gồm: – Natri (Na): giúp kiểm soát lượng dịch trong cơ thể, đảm bảo hoạt động của các dây thần kinh và cơ bắp. – Clorua (Cl): cũng giúp kiểm soát lượng dịch trong cơ thể, điều hòa thể tích máu và huyết áp. – Kali (K): đảm bảo sự hoạt động bình thường của tim và cơ.",
 *                                      duration: 30,
 *                                      room: "67f2519ec765019a3fd5ec9a",
 *                                      doctor: "67e9180afb886c8bef80f7c3",
 *                                      price: 78000,
 *                                      specialization: "67e9180afb886c8bef80f7c3"
 *                                  }
 *                              message:
 *                                  type: string
 *                                  example: "Consultation service created successfully"
 *          400:
 *              description: Invalid request body
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /consultation-service/{id}:
 *  get:
 *      summary: Get a consultation service by ID
 *      description: Retrieve a specific consultation service by its ID
 *      tags: [Consultation Service]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              format: uid
 *            description: Consultation Service ID
 *      responses:
 *          200:
 *              description: Consultation service retrieved successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  $ref: '#/components/schemas/ConsultationService'
 *                                  example: {
 *                                      _id: "666666666666666666666666",
 *                                      name: "Điện Giải Đồ (Na + K + Cl)",
 *                                      description: "Chất điện giải là các khoáng chất giúp kiểm soát lượng dịch và sự cân bằng của axit và bazơ trong cơ thể. Xét nghiệm điện giải đồ bao gồm: – Natri (Na): giúp kiểm soát lượng dịch trong cơ thể, đảm bảo hoạt động của các dây thần kinh và cơ bắp. – Clorua (Cl): cũng giúp kiểm soát lượng dịch trong cơ thể, điều hòa thể tích máu và huyết áp. – Kali (K): đảm bảo sự hoạt động bình thường của tim và cơ.",
 *                                      duration: 30,
 *                                      room: "67f2519ec765019a3fd5ec9a",
 *                                      doctor: "67e9180afb886c8bef80f7c3",
 *                                      price: 78000,
 *                                      specialization: "67e9180afb886c8bef80f7c3"
 *                                  }
 *                              message:
 *                                  type: string
 *                                  example: "Consultation service retrieved successfully"
 *          400:
 *              description: Invalid consultation service ID
 *          404:
 *              description: Consultation service not found
 *  put:
 *      summary: Update a consultation service
 *      description: Update a specific consultation service by its ID
 *      tags: [Consultation Service]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              format: uid
 *            description: Consultation Service ID
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Updated Consultation Service"
 *                          description:
 *                              type: string
 *                              example: "Updated description"
 *                          duration:
 *                              type: integer
 *                              minimum: 1
 *                              example: 45
 *                          room:
 *                              type: string
 *                              format: uid
 *                              example: "67f2519ec765019a3fd5ec9a"
 *                          doctor:
 *                              type: string
 *                              format: uid
 *                              example: "67e9180afb886c8bef80f7c3"
 *                          price:
 *                              type: number
 *                              minimum: 0
 *                              example: 85000
 *                          specialization:
 *                              type: string
 *                              format: uid
 *                              example: "67e9180afb886c8bef80f7c3"
 *      responses:
 *          200:
 *              description: Consultation service updated successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  $ref: '#/components/schemas/ConsultationService'
 *                                  example: {
 *                                      _id: "666666666666666666666666",
 *                                      name: "Updated Consultation Service",
 *                                      description: "Updated description",
 *                                      duration: 45,
 *                                      room: "67f2519ec765019a3fd5ec9a",
 *                                      doctor: "67e9180afb886c8bef80f7c3",
 *                                      price: 85000,
 *                                      specialization: "67e9180afb886c8bef80f7c3"
 *                                  }
 *                              message:
 *                                  type: string
 *                                  example: "Consultation service updated successfully"
 *          400:
 *              description: Invalid request body or consultation service ID
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Admin access required
 *          404:
 *              description: Consultation service not found
 *  delete:
 *      summary: Delete a consultation service
 *      description: Delete a specific consultation service by its ID
 *      tags: [Consultation Service]
 *      security:
 *          - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: string
 *              format: uid
 *            description: Consultation Service ID
 *      responses:
 *          200:
 *              description: Consultation service deleted successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  $ref: '#/components/schemas/ConsultationService'
 *                                  example: {
 *                                      _id: "666666666666666666666666",
 *                                      name: "Điện Giải Đồ (Na + K + Cl)",
 *                                      description: "Chất điện giải là các khoáng chất giúp kiểm soát lượng dịch và sự cân bằng của axit và bazơ trong cơ thể. Xét nghiệm điện giải đồ bao gồm: – Natri (Na): giúp kiểm soát lượng dịch trong cơ thể, đảm bảo hoạt động của các dây thần kinh và cơ bắp. – Clorua (Cl): cũng giúp kiểm soát lượng dịch trong cơ thể, điều hòa thể tích máu và huyết áp. – Kali (K): đảm bảo sự hoạt động bình thường của tim và cơ.",
 *                                      duration: 30,
 *                                      room: "67f2519ec765019a3fd5ec9a",
 *                                      doctor: "67e9180afb886c8bef80f7c3",
 *                                      price: 78000,
 *                                      specialization: "67e9180afb886c8bef80f7c3"
 *                                  }
 *                              message:
 *                                  type: string
 *                                  example: "Consultation service deleted successfully"
 *          400:
 *              description: Invalid consultation service ID
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Admin access required
 *          404:
 *              description: Consultation service not found
 */

/**
 * @swagger
 * /consultation-service/many:
 *  get:
 *      summary: Get many consultation services with advanced filtering and pagination
 *      description: Retrieve a list of consultation services with support for filtering, pagination, and sorting
 *      tags: [Consultation Service]
 *      parameters:
 *          - in: query
 *            name: options
 *            schema:
 *              type: string
 *            description: |
 *              JSON string containing query options. When provided, individual parameters are ignored.
 *              Example: {"filter":{"specialization":"67e9180afb886c8bef80f7c3","price":{"$gte":50000,"$lte":100000}},"pagination":{"page":1,"limit":5},"sort":{"createdAt":-1}}
 *            example: '{"filter":{"specialization":"67e9180afb886c8bef80f7c3"},"pagination":{"page":1,"limit":5}}'
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *              minimum: 1
 *              default: 1
 *            description: Page number for pagination (ignored if options parameter is provided)
 *            example: 1
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *              minimum: 1
 *              maximum: 100
 *              default: 10
 *            description: Number of items per page (ignored if options parameter is provided)
 *            example: 10
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            description: Search term to filter services by name (case-insensitive, ignored if options parameter is provided)
 *            example: "điện giải"
 *          - in: query
 *            name: specialization
 *            schema:
 *              type: string
 *              format: uid
 *            description: Filter services by specialization ID (ignored if options parameter is provided)
 *            example: "67e9180afb886c8bef80f7c3"
 *          - in: query
 *            name: doctor
 *            schema:
 *              type: string
 *              format: uid
 *            description: Filter services by doctor ID (ignored if options parameter is provided)
 *            example: "67e9180afb886c8bef80f7c3"
 *          - in: query
 *            name: duration
 *            schema:
 *              type: integer
 *              minimum: 1
 *            description: Filter services by exact duration in minutes (ignored if options parameter is provided)
 *            example: 30
 *          - in: query
 *            name: minPrice
 *            schema:
 *              type: number
 *              minimum: 0
 *            description: Minimum price filter (ignored if options parameter is provided)
 *            example: 50000
 *          - in: query
 *            name: maxPrice
 *            schema:
 *              type: number
 *              minimum: 0
 *            description: Maximum price filter (ignored if options parameter is provided)
 *            example: 100000
 *      responses:
 *          200:
 *              description: Consultation services retrieved successfully with pagination information
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              data:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/ConsultationService'
 *                                  example: [{
 *                                      _id: "666666666666666666666666",
 *                                      name: "Điện Giải Đồ (Na + K + Cl)",
 *                                      description: "Chất điện giải là các khoáng chất giúp kiểm soát lượng dịch và sự cân bằng của axit và bazơ trong cơ thể.",
 *                                      duration: 30,
 *                                      room: "666666666666666666666666",
 *                                      doctor: "666666666666666666666666",
 *                                      price: 78000,
 *                                      specialization: "666666666666666666666666"
 *                                  }]
 *                              pagination:
 *                                  type: object
 *                                  properties:
 *                                      total:
 *                                          type: integer
 *                                          example: 50
 *                                      page:
 *                                          type: integer
 *                                          example: 1
 *                                      limit:
 *                                          type: integer
 *                                          example: 10
 *                                      pages:
 *                                          type: integer
 *                                          example: 5
 *                              message:
 *                                  type: string
 *                                  example: "Consultation services retrieved successfully"
 *          400:
 *              description: Invalid request parameters
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: false
 *                              error:
 *                                  type: string
 *                                  example: Invalid options format. Please provide a valid JSON string.
 *          401:
 *              description: Unauthorized
 *          403:
 *              description: Forbidden - Admin access required
 */
