import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import fs from 'fs';

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
        url: process.env.SERVER_URL,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: process.env.NODE_ENV === 'dev' ? 'https' : 'http',
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
