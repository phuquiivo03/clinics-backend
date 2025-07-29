/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management endpoints
 */

/**
 * @swagger
 * /blog:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - coverImage
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post
 *                 example: "Understanding Heart Health"
 *               content:
 *                 type: string
 *                 description: The main content of the blog post
 *                 example: "Heart health is crucial for overall well-being..."
 *               coverImage:
 *                 type: string
 *                 description: The URL of the blog post cover image
 *                 example: "https://example.com/images/heart-health.jpg"
 *               active:
 *                 type: boolean
 *                 description: Whether the blog post should be active
 *                 default: false
 *                 example: true
 *               specialties:
 *                 type: array
 *                 description: The specialties of the blog post
 *                 items:
 *                   type: string
 *                 example: ["heart-health", "nutrition"]
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit number of blog posts
 *         default: 10
 *     responses:
 *       200:
 *         description: List of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/many:
 *   get:
 *     summary: Get blog posts with advanced filtering, sorting and pagination
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: options
 *         schema:
 *           type: string
 *         description: JSON string with query options for filtering, sorting, and pagination. The options object can include filter, sort, and pagination properties.
 *         example: '{"filter":{"active":true,"title":{"$regex":"health","$options":"i"}},"sort":{"createdAt":-1},"pagination":{"page":1,"limit":10}, "populateOptions": {"path": "author", "select": ["name", "email"]}}'
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number (used only if options is not provided)
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Number of blogs per page (used only if options is not provided)
 *         default: 10
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter blogs by title (case-insensitive search) (used only if options is not provided)
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter blogs by active status (used only if options is not provided)
 *       - in: query
 *         name: specialties
 *         schema:
 *           type: string
 *         description: Filter blogs by specialties (comma-separated list of specialty IDs) (used only if options is not provided)
 *     responses:
 *       200:
 *         description: List of blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Blog'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           description: Total number of blogs
 *                           example: 100
 *                         page:
 *                           type: integer
 *                           description: Current page number
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           description: Number of blogs per page
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                           example: 10
 *       400:
 *         description: Bad request - Invalid options format
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/createMany:
 *   post:
 *     summary: Create multiple blog posts
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - title
 *                 - content
 *                 - coverImage
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the blog post
 *                   example: "Understanding Heart Health"
 *                 content:
 *                   type: string
 *                   description: The main content of the blog post
 *                   example: "Heart health is crucial for overall well-being..."
 *                 coverImage:
 *                   type: string
 *                   description: The URL of the blog post cover image
 *                   example: "https://example.com/images/heart-health.jpg"
 *                 active:
 *                   type: boolean
 *                   description: Whether the blog post should be active
 *                   default: false
 *                   example: true
 *     responses:
 *       201:
 *         description: Blog posts created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/active:
 *   get:
 *     summary: Get all active blog posts
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         description: Page number
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         description: Limit number of blog posts
 *         default: 10
 *     responses:
 *       200:
 *         description: List of active blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Blog'
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/{id}:
 *   get:
 *     summary: Get a blog post by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 *   put:
 *     summary: Update a blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post
 *               content:
 *                 type: string
 *                 description: The main content of the blog post
 *               coverImage:
 *                 type: string
 *                 description: The URL of the blog post cover image
 *               active:
 *                 type: boolean
 *                 description: Whether the blog post should be active
 *     responses:
 *       200:
 *         description: Blog post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /blog/{id}/toggle:
 *   patch:
 *     summary: Toggle blog post active status
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Blog'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 *       500:
 *         description: Internal server error
 */
