/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - role
 *         - phoneNumber
 *       properties:
 *         name:
 *           type: string
 *           nullable: true
 *           description: The user's full name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         password:
 *           type: string
 *           format: password
 *           description: The user's password (only required for creation)
 *         role:
 *           type: string
 *           enum: [user, admin, doctor, nurse, receptionist]
 *           description: The user's role in the system
 *         phoneNumber:
 *           type: string
 *           description: The user's phone number
 *         address:
 *           type: string
 *           nullable: true
 *           description: The user's address
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: The user's date of birth
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           nullable: true
 *           description: The user's gender
 *         occupation:
 *           type: string
 *           nullable: true
 *           description: The user's occupation
 *         doctor:
 *           type: string
 *           format: uid
 *           description: Reference to doctor ID if user is a patient
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the user was last updated
 *       example:
 *         name: John Doe
 *         email: john.doe@example.com
 *         password: password123
 *         role: patient
 *         phoneNumber: "+1234567890"
 *         address: "123 Main St, City, Country"
 *         dateOfBirth: "1990-01-01"
 *         gender: "male"
 *         occupation: "Software Engineer"
 *         doctor: "507f1f77bcf86cd799439011"
 *         createdAt: "2024-01-01T00:00:00.000Z"
 *         updatedAt: "2024-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - user
 *         - specialization
 *         - experience
 *         - consultationFee
 *       properties:
 *         _id:
 *           type: string
 *           format: uid
 *           description: The unique identifier for the doctor
 *           example: "67e9180afb886c8bef80f7c3"
 *         user:
 *           type: string
 *           format: uid
 *           description: Reference to the user account associated with this doctor
 *           example: "67e8411218eb67934f9947a8"
 *         specialization:
 *           type: string
 *           description: The medical specialization of the doctor
 *           example: "Cardiologist"
 *         experience:
 *           type: integer
 *           minimum: 0
 *           description: Years of experience in the field
 *           example: 10
 *         qualifications:
 *           type: array
 *           items:
 *             type: string
 *           description: List of qualifications and certifications
 *           example: ["MBBS", "MD - Cardiology"]
 *         bio:
 *           type: string
 *           nullable: true
 *           description: A brief biography or description of the doctor
 *           example: "Dr. John Smith is a board-certified cardiologist with over 10 years of experience."
 *         consultationFee:
 *           type: number
 *           minimum: 0
 *           description: The fee charged for a consultation
 *           example: 150
 *         availability:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *               slots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startTime:
 *                       type: string
 *                       format: time
 *                     endTime:
 *                       type: string
 *                       format: time
 *           description: The doctor's availability schedule
 *           example: []
 *         reviews:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 format: uid
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *           description: Reviews from patients
 *           example: []
 *         averageRating:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           description: The average rating of the doctor based on reviews
 *           example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the doctor was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the doctor was last updated
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - name
 *         - roomNumber
 *         - roomFloor
 *       properties:
 *         _id:
 *           type: string
 *           format: uid
 *           description: The unique identifier for the room
 *           example: "666666666666666666666666"
 *         name:
 *           type: string
 *           description: The name of the room
 *           example: "Consultation Room 1"
 *         roomNumber:
 *           type: number
 *           description: The room number
 *           example: 101
 *         roomFloor:
 *           type: number
 *           description: The floor where the room is located
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the room was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the room was last updated
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ConsultationService:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - duration
 *         - room
 *         - doctor
 *         - price
 *       properties:
 *         _id:
 *           type: string
 *           format: uid
 *           description: The unique identifier for the consultation service
 *           example: "666666666666666666666666"
 *         name:
 *           type: string
 *           description: The name of the consultation service
 *           example: "General Checkup"
 *         description:
 *           type: string
 *           description: A detailed description of the consultation service
 *           example: "A comprehensive general health checkup including vital signs, physical examination, and basic health screening"
 *         duration:
 *           type: integer
 *           minimum: 1
 *           description: The duration of the consultation in minutes
 *           example: 30
 *         room:
 *           type: string
 *           format: uid
 *           description: Reference to the room where the consultation takes place
 *           example: "666666666666666666666666"
 *         doctor:
 *           type: string
 *           format: uid
 *           description: Reference to the doctor who provides the consultation
 *           example: "67e9180afb886c8bef80f7c3"
 *         price:
 *           type: number
 *           minimum: 0
 *           description: The price of the consultation service
 *           example: 150.00
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the consultation service was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the consultation service was last updated
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ConsultationPackage:
 *       type: object
 *       required:
 *         - icon
 *         - title
 *         - description
 *         - features
 *         - priceOptions
 *         - tests
 *         - maxSlotPerPeriod
 *       properties:
 *         _id:
 *           type: string
 *           format: uid
 *           description: The unique identifier for the consultation package
 *           example: "67f2519ec765019a3fd5ec9a"
 *         icon:
 *           type: string
 *           description: URL to the icon image for the package
 *           example: "https://example.com/icons/arthritis.png"
 *         title:
 *           type: string
 *           description: The name of the package (e.g., "Viêm khớp")
 *           example: "Viêm khớp"
 *         description:
 *           type: string
 *           description: Brief details about the package
 *           example: "Gói khám chuyên sâu về bệnh viêm khớp, bao gồm các xét nghiệm và tư vấn từ chuyên gia."
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: List of benefits (e.g., early detection, progress tracking)
 *           example: ["Phát hiện sớm", "Theo dõi tiến triển", "Tư vấn chuyên sâu"]
 *         priceOptions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PriceOption'
 *           description: Different package tiers (Basic, Advanced)
 *           example: [
 *             {
 *               tier: "Basic",
 *               price: 500000,
 *               testsIncluded: 5
 *             },
 *             {
 *               tier: "Advanced",
 *               price: 1000000,
 *               testsIncluded: 10
 *             }
 *           ]
 *         tests:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ConsultationService'
 *           description: List of test categories and individual tests
 *           example: ["67f2519ec765019a3fd5ec9a", "67f2519ec765019a3fd5ec9b"]
 *         maxSlotPerPeriod:
 *           type: integer
 *           minimum: 1
 *           description: Maximum number of slots available per period
 *           example: 10
 *         faq:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FAQItem'
 *           description: Frequently asked questions
 *           example: [
 *             {
 *               question: "Gói khám này có bao gồm những gì?",
 *               answer: "Gói khám bao gồm xét nghiệm máu, chụp X-quang, và tư vấn từ bác sĩ chuyên khoa."
 *             }
 *           ]
 *         bookingOptions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookingOption'
 *           description: Methods to book the package
 *           example: [
 *             {
 *               type: "Branch",
 *               description: "Đặt lịch tại phòng khám",
 *               actionUrl: "https://example.com/book/branch"
 *             },
 *             {
 *               type: "Home Sample Collection",
 *               description: "Lấy mẫu tại nhà",
 *               actionUrl: "https://example.com/book/home"
 *             }
 *           ]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the package was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the package was last updated
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PriceOption:
 *       type: object
 *       required:
 *         - tier
 *         - price
 *         - testsIncluded
 *       properties:
 *         tier:
 *           type: string
 *           description: The tier name (e.g., "Basic", "Advanced")
 *           example: "Basic"
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Price in VND
 *           example: 500000
 *         testsIncluded:
 *           type: integer
 *           minimum: 0
 *           description: Number of tests included
 *           example: 5
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FAQItem:
 *       type: object
 *       required:
 *         - question
 *         - answer
 *       properties:
 *         question:
 *           type: string
 *           description: FAQ question
 *           example: "Gói khám này có bao gồm những gì?"
 *         answer:
 *           type: string
 *           description: FAQ answer
 *           example: "Gói khám bao gồm xét nghiệm máu, chụp X-quang, và tư vấn từ bác sĩ chuyên khoa."
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BookingOption:
 *       type: object
 *       required:
 *         - type
 *         - description
 *         - actionUrl
 *       properties:
 *         type:
 *           type: string
 *           enum: [Branch, Home Sample Collection]
 *           description: The type of booking option
 *           example: "Branch"
 *         description:
 *           type: string
 *           description: Details of the option
 *           example: "Đặt lịch tại phòng khám"
 *         actionUrl:
 *           type: string
 *           description: Link to book the service
 *           example: "https://example.com/book/branch"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           format: uid
 *           description: The unique identifier for the blog
 *           example: "507f1f77bcf86cd799439011"
 *         title:
 *           type: string
 *           description: The title of the blog post
 *           example: "Understanding Heart Health"
 *         content:
 *           type: string
 *           description: The main content of the blog post
 *           example: "Heart health is crucial for overall well-being..."
 *         active:
 *           type: boolean
 *           description: Whether the blog post is active and visible
 *           default: false
 *           example: true
 *         author:
 *           type: string
 *           format: uid
 *           description: Reference to the user who created the blog post
 *           example: "507f1f77bcf86cd799439011"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the blog was created
 *           example: "2024-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the blog was last updated
 *           example: "2024-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Specialty:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the specialty
 *         name:
 *           type: string
 *           description: The name of the specialty
 *         description:
 *           type: string
 *           description: The description of the specialty
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the specialty was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the specialty was last updated
 *       example:
 *         _id: 507f1f77bcf86cd799439011
 *         name: Cardiology
 *         description: Medical specialty dealing with disorders of the heart
 *         createdAt: 2024-04-22T10:00:00.000Z
 *         updatedAt: 2024-04-22T10:00:00.000Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Promotion:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *         - condition
 *         - regulation
 *         - discountType
 *         - discountValue
 *         - validFrom
 *         - validTo
 *       properties:
 *         _id:
 *           type: string
 *           format: uid
 *           description: The unique identifier for the promotion
 *           example: "507f1f77bcf86cd799439011"
 *         title:
 *           type: string
 *           description: The title of the promotion
 *           example: "Summer Sale 2024"
 *         description:
 *           type: string
 *           description: The description of the promotion
 *           example: "Get amazing discounts on all summer items"
 *         image:
 *           type: string
 *           description: The URL of the promotion image
 *           example: "https://example.com/images/summer-sale.jpg"
 *         condition:
 *           type: string
 *           description: The conditions for the promotion
 *           example: "Minimum purchase of $100"
 *         regulation:
 *           type: string
 *           description: The regulations for the promotion
 *           example: "Cannot be combined with other promotions"
 *         discountType:
 *           type: string
 *           enum: [Miễn phí, percentage, price]
 *           description: The type of discount
 *           example: "percentage"
 *         discountValue:
 *           type: string
 *           description: The value of the discount
 *           example: "20"
 *         validFrom:
 *           type: string
 *           format: date-time
 *           description: The start date of the promotion
 *           example: "2024-06-01T00:00:00Z"
 *         validTo:
 *           type: string
 *           format: date-time
 *           description: The end date of the promotion
 *           example: "2024-08-31T23:59:59Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the promotion was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the promotion was last updated
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         title: "Summer Sale 2024"
 *         description: "Get amazing discounts on all summer items"
 *         image: "https://example.com/images/summer-sale.jpg"
 *         condition: "Minimum purchase of $100"
 *         regulation: "Cannot be combined with other promotions"
 *         discountType: "percentage"
 *         discountValue: "20"
 *         validFrom: "2024-06-01T00:00:00Z"
 *         validTo: "2024-08-31T23:59:59Z"
 *         createdAt: "2024-04-22T10:00:00.000Z"
 *         updatedAt: "2024-04-22T10:00:00.000Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Image:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uid
 *           description: The unique identifier for the image
 *           example: "507f1f77bcf86cd799439011"
 *         url:
 *           type: string
 *           description: The URL of the uploaded image
 *           example: "https://example.com/uploads/image123.jpg"
 *         filename:
 *           type: string
 *           description: The original filename of the uploaded image
 *           example: "profile_picture.jpg"
 *         originalName:
 *           type: string
 *           description: The original name of the uploaded file
 *           example: "my-photo.jpg"
 *         mimetype:
 *           type: string
 *           description: The MIME type of the uploaded image
 *           example: "image/jpeg"
 *         size:
 *           type: number
 *           description: The size of the uploaded image in bytes
 *           example: 1024000
 *         uploadedBy:
 *           type: string
 *           format: uid
 *           description: Reference to the user who uploaded the image
 *           example: "507f1f77bcf86cd799439011"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the image was uploaded
 *           example: "2024-04-22T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the image record was last updated
 *           example: "2024-04-22T10:00:00.000Z"
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         url: "https://example.com/uploads/image123.jpg"
 *         filename: "image123.jpg"
 *         originalName: "my-photo.jpg"
 *         mimetype: "image/jpeg"
 *         size: 1024000
 *         uploadedBy: "507f1f77bcf86cd799439011"
 *         createdAt: "2024-04-22T10:00:00.000Z"
 *         updatedAt: "2024-04-22T10:00:00.000Z"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patient
 *         - doctor
 *         - date
 *         - startTime
 *         - endTime
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           format: uid
 *           description: The unique identifier for the appointment
 *           example: "507f1f77bcf86cd799439011"
 *         patient:
 *           type: string
 *           format: uid
 *           description: Reference to the patient (User)
 *           example: "507f1f77bcf86cd799439012"
 *         doctor:
 *           type: string
 *           format: uid
 *           description: Reference to the doctor
 *           example: "507f1f77bcf86cd799439013"
 *         date:
 *           type: string
 *           format: date
 *           description: The appointment date
 *           example: "2024-04-25"
 *         startTime:
 *           type: string
 *           description: The appointment start time
 *           example: "09:00"
 *         endTime:
 *           type: string
 *           description: The appointment end time
 *           example: "10:00"
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled, completed]
 *           description: The current status of the appointment
 *           example: "pending"
 *         symptoms:
 *           type: string
 *           description: Patient symptoms (optional)
 *           example: "Chest pain and shortness of breath"
 *         diagnosis:
 *           type: string
 *           description: Medical diagnosis (filled by doctor)
 *           example: "Acute myocardial infarction"
 *         prescription:
 *           type: string
 *           description: Prescribed medications (filled by doctor)
 *           example: "Aspirin 81mg daily, Atorvastatin 40mg daily"
 *         notes:
 *           type: string
 *           description: Additional notes from the consultation
 *           example: "Patient responded well to treatment. Follow-up in 2 weeks."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the appointment was created
 *           example: "2024-04-22T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the appointment was last updated
 *           example: "2024-04-22T10:00:00.000Z"
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         patient: "507f1f77bcf86cd799439012"
 *         doctor: "507f1f77bcf86cd799439013"
 *         date: "2024-04-25"
 *         startTime: "09:00"
 *         endTime: "10:00"
 *         status: "pending"
 *         symptoms: "Chest pain and shortness of breath"
 *         diagnosis: ""
 *         prescription: ""
 *         notes: ""
 *         createdAt: "2024-04-22T10:00:00.000Z"
 *         updatedAt: "2024-04-22T10:00:00.000Z"
 */
