import type { RequestHandler } from 'express';
import { consultationPackageService } from '../services/index.service';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { createConsultationPackageSchema, findConsultationPackageByIdSchema } from '../schemas';
import type { MongooseFindManyOptions } from '../repositories/type';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = createConsultationPackageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const validatedData = validationResult.data;

    // Convert test IDs to ObjectIds
    const packageData: any = {
      ...validatedData,
      tests: validatedData.tests.map((id) => new mongoose.Types.ObjectId(id)),
    };

    const consultationPackage = await consultationPackageService.create(packageData);
    if (consultationPackage) {
      return appExpress.response201(consultationPackage);
    }
    throw new Error('Invalid package data');
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const createMany: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const consultationPackages = await consultationPackageService.createMany(req.body);
    if (consultationPackages) {
      return appExpress.response201(consultationPackages);
    }
    throw new Error('Invalid package data');
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findById: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the ID parameter
    const validationResult = findConsultationPackageByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const consultationPackage = await consultationPackageService.findById(id);
    if (consultationPackage) {
      return appExpress.response200(consultationPackage);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findByIdWithFullDetails: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the ID parameter
    const validationResult = findConsultationPackageByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const consultationPackage = await consultationPackageService.findByIdWithFullDetails(id);
    if (consultationPackage) {
      return appExpress.response200(consultationPackage);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findAll: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const consultationPackages = await consultationPackageService.findAll({
      selectFields: ['title', 'icon'],
    });
    appExpress.response200(consultationPackages);
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
    selectFields: ['title', 'icon'],
  };
  try {
    const consultationPackages = await consultationPackageService.findMany(options);
    appExpress.response200(consultationPackages);
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
  findByIdWithFullDetails,
  findAll,
  findMany,
};
