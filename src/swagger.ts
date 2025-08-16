import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';
import { MedicalExaminationResultSchema, PrescriptionSchema } from './docs/components/schemas';
import { medicalExaminationPaths } from './docs/paths/medical-examination.docs';
import { chatPaths } from './docs/paths/chat.docs';
import { prescriptionPaths } from './docs/paths/prescription.docs';
import { schedulePaths, ScheduleSchemas } from './docs/paths/schedule.swagger';
import { authPaths } from './docs/paths/auth.docs';
import { paymentPaths } from './docs/paths/payment.docs';
import { waitingMessagePaths, WaitingMessageSchemas } from './docs/paths/waitingMessage.docs';

// Get all route files recursively
const getRouteFiles = (dir: string): string[] => {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...getRouteFiles(fullPath));
    } else if (item.endsWith('.ts') && (item.includes('route') || item.includes('routes'))) {
      files.push(fullPath);
    }
  }

  return files;
};

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Clinics Management API',
      version: '1.0.0',
      description: 'API documentation for the Clinics Management System',
    },
    servers: [
      {
        url: `${process.env.SERVER_URL || 'http://localhost:8081'}/api/v1`,
        description: 'Development server',
      },
    ],
    paths: {
      ...medicalExaminationPaths,
      ...chatPaths,
      ...prescriptionPaths,
      ...schedulePaths,
      ...authPaths,
      ...paymentPaths,
      ...waitingMessagePaths,
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
        WaitingMessage: WaitingMessageSchemas.WaitingMessage,
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/docs/paths/*.ts', 'src/docs/components/*.ts'], // Include both paths and components
};

export const swaggerSpec = swaggerJsdoc(options);
