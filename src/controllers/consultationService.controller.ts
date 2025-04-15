import type { RequestHandler } from 'express';
import { consultationServiceService } from '../services/index.service';
import type { IConsultationServiceRequest } from '../dto';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { createConsultationServiceSchema, findConsultationServiceByIdSchema } from '../schemas';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import type { MongooseFindManyOptions } from '../repositories/type';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = createConsultationServiceSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const validatedData = validationResult.data;
    // Prepare service data with proper room reference
    const serviceData: any = {
      name: validatedData.name,
      description: validatedData.description,
      duration: validatedData.duration,
      price: validatedData.price,
      room: new mongoose.Types.ObjectId(validatedData.room),
      doctor: new mongoose.Types.ObjectId(validatedData.doctor),
    };

    const consultationService = await consultationServiceService.create(serviceData);
    if (consultationService) {
      return appExpress.response201(consultationService);
    }
    throw new Error('Invalid service data');
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};

const findById: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the ID parameter
    const validationResult = findConsultationServiceByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const consultationService = await consultationServiceService.findById(id);
    if (consultationService) {
      return appExpress.response200(consultationService);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const createMany: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const servicesData = req.body;
    if (!Array.isArray(servicesData)) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
        message: 'Request body must be an array',
      });
    }

    // Validate and transform each item
    const processedData = servicesData.map((item) => {
      const validationResult = createConsultationServiceSchema.safeParse(item);
      if (!validationResult.success) {
        throw new Error('Invalid service data in array');
      }

      const validatedItem = validationResult.data;
      return {
        name: validatedItem.name,
        description: validatedItem.description,
        duration: validatedItem.duration,
        price: validatedItem.price,
        room: new mongoose.Types.ObjectId(validatedItem.room),
        doctor: new mongoose.Types.ObjectId(validatedItem.doctor),
      };
    });

    // Use type assertion to match expected type
    const consultationServices = await consultationServiceService.createMany(processedData as any);
    if (consultationServices) {
      return appExpress.response201(consultationServices);
    }
    throw new Error('Invalid service data');
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findAll: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const consultationServices = await consultationServiceService.findAll();
    appExpress.response200(consultationServices);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};
const findMany: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  const { page, limit } = req.query;
  const options: MongooseFindManyOptions = {
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
    },
  };
  try {
    const consultationServices = await consultationServiceService.findMany(options);
    appExpress.response200(consultationServices);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

export default {
  create,
  createMany,
  findById,
  findAll,
  findMany,
};
