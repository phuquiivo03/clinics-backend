import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';
import { MedicalExaminationResultSchema, PrescriptionSchema } from './docs/components/schemas';
import { medicalExaminationPaths } from './docs/paths/medical-examination.docs';
import { prescriptionPaths } from './docs/paths/prescription.docs';
import { schedulePaths, ScheduleSchemas } from './docs/paths/schedule.swagger';
import { authPaths } from './docs/paths/auth.docs';
import { paymentPaths } from './docs/paths/payment.docs';

// Get all route files recursively - this function is kept for potential future use
const getRouteFiles = (dir: string): string[] => {
  const files: string[] = [];
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...getRouteFiles(fullPath));
      } else if (item.endsWith('.ts') && (item.includes('route') || item.includes('routes'))) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }

  return files;
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clinics Management API',
      version: '1.0.0',
      description: `
        API documentation for the Clinics Management System
        
        ## Authentication
        Most endpoints require authentication using JWT Bearer tokens.
        Include the token in the Authorization header as: Bearer <your-token>
        
        ## Base URL
        All API endpoints are prefixed with /api/v1/
        
        ## Response Format
        All responses follow a consistent format:
        - success: boolean indicating operation success
        - data: the actual response data
        - message: optional message providing additional information
        - error: error message (only present when success is false)
        
        ## Features
        - Complete medical examination tracking with ICD-10 coding
        - Prescription management system with medication tracking
        - Healthcare booking system for services and packages
        - Role-based access control (Admin, Doctor, Patient)
        - File upload support for images and documents
        - Comprehensive pagination support
        - Real-time scheduling and appointment management
        
        ## Available Modules
        This API covers 18 different modules including authentication, user management,
        doctor profiles, consultation services and packages, medical examinations,
        prescriptions, scheduling, room management, blogs, promotions, specialties,
        and image management.
      `,
      termsOfService: 'https://clinics.example.com/terms',
      contact: {
        name: 'API Support',
        url: 'https://clinics.example.com/support',
        email: 'support@clinics.example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL || 'http://localhost:8081',
        description: 'Development server',
      },
      {
        url: 'https://api.clinics.example.com',
        description: 'Production server (if applicable)',
      },
    ],
    paths: {
      ...authPaths,
      ...schedulePaths,
      ...prescriptionPaths,
      ...medicalExaminationPaths,
      ...prescriptionPaths,
      ...schedulePaths,
      ...authPaths,
      ...paymentPaths,
    },
    components: {
      schemas: {
        ICDCode: MedicalExaminationResultSchema.ICDCode,
        SubclinicalResult: MedicalExaminationResultSchema.SubclinicalResult,
        MedicalExaminationResult: MedicalExaminationResultSchema.MedicalExaminationResult,
        MedicalExaminationResultCreate:
          MedicalExaminationResultSchema.MedicalExaminationResultCreate,
        MedicalExaminationResultUpdate:
          MedicalExaminationResultSchema.MedicalExaminationResultUpdate,
        Medication: PrescriptionSchema.Medication,
        Prescription: PrescriptionSchema.Prescription,
        PrescriptionCreate: PrescriptionSchema.PrescriptionCreate,
        PrescriptionUpdate: PrescriptionSchema.PrescriptionUpdate,
        Schedule: ScheduleSchemas.Schedule,
        Error: {
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
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                  error: {
                    type: 'string',
                    example: 'Unauthorized access',
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Request validation failed',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                  error: {
                    type: 'string',
                    example: 'Validation failed',
                  },
                  details: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['Name is required', 'Email must be valid'],
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                  error: {
                    type: 'string',
                    example: 'Resource not found',
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: false,
                  },
                  error: {
                    type: 'string',
                    example: 'Internal server error',
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Doctors',
        description: 'Doctor profile and management operations',
      },
      {
        name: 'Consultation Packages',
        description: 'Medical consultation package management',
      },
      {
        name: 'Consultation Service',
        description: 'Individual consultation service management',
      },
      {
        name: 'Room',
        description: 'Medical facility room management',
      },
      {
        name: 'Schedules',
        description: 'Appointment and schedule management',
      },
      {
        name: 'Prescriptions',
        description: 'Medical prescription management and medication tracking',
      },
      {
        name: 'Medical Examination',
        description: 'Healthcare examination tracking with ICD-10 coding',
      },
      {
        name: 'Appointments',
        description: 'Medical appointment booking and management (In development)',
      },
      {
        name: 'Day Package',
        description: 'Day package management for consultation packages',
      },
      {
        name: 'Period Package',
        description: 'Period package management for consultation time slots',
      },
      {
        name: 'Package Week',
        description: 'Weekly package scheduling and management',
      },
      {
        name: 'Blogs',
        description: 'Health blog and article management',
      },
      {
        name: 'Promotions',
        description: 'Marketing promotion management',
      },
      {
        name: 'Specialties',
        description: 'Medical specialty management',
      },
      {
        name: 'Images',
        description: 'Image upload and management',
      },
      {
        name: 'Health',
        description: 'API health check endpoints',
      },
    ],
  },
  apis: [
    'src/docs/paths/*.ts',
    'src/docs/components/*.ts',
    'src/routes/health.ts', // Include health route that has inline documentation
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
