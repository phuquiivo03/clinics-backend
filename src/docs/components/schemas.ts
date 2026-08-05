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
 *         - room
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
 *         room:
 *           type: string
 *           format: uid
 *           description: Reference to the room where the doctor practices
 *           example: "666666666666666666666666"
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

export const MedicalExaminationResultSchema = {
  ICDCode: {
    type: 'object',
    properties: {
      icdCode: {
        type: 'string',
        example: 'J45.0',
      },
      description: {
        type: 'string',
        example: 'Bronchial asthma',
      },
    },
  },
  SubclinicalResult: {
    type: 'object',
    properties: {
      service: {
        type: 'string',
        example: '60d21b4667d0d8992e610c85',
      },
      resultData: {
        type: 'string',
        example: 'Normal blood count results',
      },
      performedAt: {
        type: 'string',
        format: 'date-time',
        example: '2023-06-15T10:30:00Z',
      },
      performedBy: {
        type: 'string',
        example: '60d21b4667d0d8992e610c86',
      },
      notes: {
        type: 'string',
        example: 'Patient was fasting as required',
      },
    },
  },
  MedicalExaminationResult: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '60d21b4667d0d8992e610c87',
      },
      patient: {
        type: 'string',
        example: '60d21b4667d0d8992e610c88',
      },
      examinationDate: {
        type: 'string',
        example: '2023-06-15',
      },
      symptoms: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['Fever', 'Cough', 'Fatigue'],
      },
      subclinicalResults: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/SubclinicalResult',
        },
      },
      services: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Array of consultation service IDs',
        example: ['60d21b4667d0d8992e610c90', '60d21b4667d0d8992e610c91'],
      },
      finalDiagnosis: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ICDCode',
        },
      },
      prescription: {
        type: 'string',
        example: '60d21b4667d0d8992e610c89',
      },
      scheduleReferrence: {
        type: 'string',
        example: '60d21b4667d0d8992e610c92',
        description: 'Reference to the schedule that this examination is related to',
      },
      followUp: {
        type: 'object',
        properties: {
          notes: {
            type: 'string',
            example: 'Follow up in two weeks to check progress',
          },
          schedule: {
            type: 'string',
            example: '60d21b4667d0d8992e610c90',
            description: 'Schedule ID for follow-up appointment',
          },
        },
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2023-06-15T10:30:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2023-06-15T10:30:00Z',
      },
    },
  },
  MedicalExaminationResultCreate: {
    type: 'object',
    required: ['patient', 'examinationDate', 'symptoms'],
    properties: {
      patient: {
        type: 'string',
        example: '60d21b4667d0d8992e610c88',
      },
      examinationDate: {
        type: 'string',
        example: '2023-06-15',
      },
      symptoms: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['Fever', 'Cough', 'Fatigue'],
      },
      subclinicalResults: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/SubclinicalResult',
        },
      },
      services: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Array of consultation service IDs',
        example: ['60d21b4667d0d8992e610c90', '60d21b4667d0d8992e610c91'],
      },
      finalDiagnosis: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ICDCode',
        },
      },
      prescription: {
        type: 'string',
        example: '60d21b4667d0d8992e610c89',
      },
      scheduleReferrence: {
        type: 'string',
        example: '60d21b4667d0d8992e610c92',
        description: 'Reference to the schedule that this examination is related to',
      },
      followUp: {
        type: 'object',
        properties: {
          notes: {
            type: 'string',
            example: 'Follow up in two weeks to check progress',
          },
          schedule: {
            type: 'string',
            example: '60d21b4667d0d8992e610c90',
            description: 'Schedule ID for follow-up appointment',
          },
        },
      },
    },
  },
  MedicalExaminationResultUpdate: {
    type: 'object',
    properties: {
      patient: {
        type: 'string',
        example: '60d21b4667d0d8992e610c88',
      },
      examinationDate: {
        type: 'string',
        example: '2023-06-15',
      },
      symptoms: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['Fever', 'Cough', 'Fatigue'],
      },
      subclinicalResults: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/SubclinicalResult',
        },
      },
      services: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Array of consultation service IDs',
        example: ['60d21b4667d0d8992e610c90', '60d21b4667d0d8992e610c91'],
      },
      finalDiagnosis: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/ICDCode',
        },
      },
      prescription: {
        type: 'string',
        example: '60d21b4667d0d8992e610c89',
      },
      scheduleReferrence: {
        type: 'string',
        example: '60d21b4667d0d8992e610c92',
        description: 'Reference to the schedule that this examination is related to',
      },
      followUp: {
        type: 'object',
        properties: {
          notes: {
            type: 'string',
            example: 'Follow up in two weeks to check progress',
          },
          schedule: {
            type: 'string',
            example: '60d21b4667d0d8992e610c90',
            description: 'Schedule ID for follow-up appointment',
          },
        },
      },
    },
  },
  MedicalExaminationAddFollowUp: {
    type: 'object',
    properties: {
      notes: {
        type: 'string',
        example: 'Tai kham',
        description: 'Additional notes for the follow-up',
      },
      schedule: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            example: '67e9180afb886c8bef80f7c3',
            description: 'User ID for the follow-up appointment',
          },
          services: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['684d6b3a9f8e1d2c3b4a5e1d'],
            description: 'Array of consultation service IDs for the follow-up',
          },
          dayOffset: {
            type: 'integer',
            minimum: 0,
            example: 1,
            description: 'Day offset for the appointment (0=Monday, 1=Tuesday, etc.)',
          },
          timeOffset: {
            type: 'integer',
            minimum: 0,
            maximum: 1,
            example: 1,
            description: 'Time offset for the appointment (0=morning, 1=afternoon)',
          },
          weekPeriod: {
            type: 'object',
            properties: {
              from: {
                type: 'string',
                format: 'date-time',
                example: '2024-04-15T00:00:00.000Z',
                description: 'Start date of the week period',
              },
              to: {
                type: 'string',
                format: 'date-time',
                example: '2024-04-15T00:00:00.000Z',
                description: 'End date of the week period',
              },
            },
            required: ['from', 'to'],
          },
        },
        required: ['userId', 'services', 'dayOffset', 'timeOffset', 'weekPeriod'],
        description: 'Schedule information for the follow-up appointment',
        example: {
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
    description: 'Schema for adding follow-up information to a medical examination result',
  },
};

export const PrescriptionSchema = {
  Medication: {
    type: 'object',
    required: ['medicine', 'quantity', 'frequency', 'duration'],
    properties: {
      medicine: {
        type: 'string',
        description: 'Reference to the medicine',
        example: '60d21b4667d0d8992e610c85',
      },
      quantity: {
        type: 'integer',
        minimum: 1,
        description: 'Quantity of medicine to be taken',
        example: 2,
      },
      frequency: {
        type: 'string',
        description: 'How often to take the medicine',
        example: 'Twice daily',
      },
      duration: {
        type: 'string',
        description: 'How long to take the medicine',
        example: '7 days',
      },
      instruction: {
        type: 'string',
        description: 'Special instructions for taking the medicine',
        example: 'Take after meals with water',
      },
    },
  },
  Prescription: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        description: 'Unique identifier for the prescription',
        example: '60d21b4667d0d8992e610c89',
      },
      dateIssued: {
        type: 'string',
        format: 'date-time',
        description: 'Date when the prescription was issued',
        example: '2023-06-15T10:30:00Z',
      },
      doctor: {
        type: 'string',
        description: 'Reference to the doctor who issued the prescription',
        example: '60d21b4667d0d8992e610c90',
      },
      patient: {
        type: 'string',
        description: 'Reference to the patient',
        example: '60d21b4667d0d8992e610c88',
      },
      diagnosis: {
        type: 'string',
        description: 'Diagnosis for which the prescription is issued',
        example: 'Acute bronchitis',
      },
      notes: {
        type: 'string',
        description: 'Additional notes about the prescription',
        example: 'Patient allergic to penicillin',
      },
      medications: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Medication',
        },
        description: 'List of medications prescribed',
      },
      totalCost: {
        type: 'number',
        minimum: 0,
        description: 'Total cost of all medications',
        example: 250000,
      },
      isPaid: {
        type: 'boolean',
        description: 'Whether the prescription has been paid for',
        example: false,
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'When the prescription was created in the system',
        example: '2023-06-15T10:30:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'When the prescription was last updated',
        example: '2023-06-15T10:30:00Z',
      },
    },
  },
  PrescriptionCreate: {
    type: 'object',
    required: ['patient', 'diagnosis', 'medications', 'totalCost'],
    properties: {
      patient: {
        type: 'string',
        description: 'Reference to the patient',
        example: '60d21b4667d0d8992e610c88',
      },
      diagnosis: {
        type: 'string',
        description: 'Diagnosis for which the prescription is issued',
        example: 'Acute bronchitis',
      },
      notes: {
        type: 'string',
        description: 'Additional notes about the prescription',
        example: 'Patient allergic to penicillin',
      },
      medications: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Medication',
        },
        description: 'List of medications prescribed',
      },
      totalCost: {
        type: 'number',
        minimum: 0,
        description: 'Total cost of all medications',
        example: 250000,
      },
    },
  },
  PrescriptionUpdate: {
    type: 'object',
    properties: {
      diagnosis: {
        type: 'string',
        description: 'Diagnosis for which the prescription is issued',
        example: 'Acute bronchitis',
      },
      notes: {
        type: 'string',
        description: 'Additional notes about the prescription',
        example: 'Patient allergic to penicillin',
      },
      medications: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Medication',
        },
        description: 'List of medications prescribed',
      },
      totalCost: {
        type: 'number',
        minimum: 0,
        description: 'Total cost of all medications',
        example: 250000,
      },
    },
  },
};
