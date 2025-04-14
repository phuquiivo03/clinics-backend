import type { RequestHandler } from 'express';
import { periodPackageService } from '../services';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { PeriodPackage } from '../types/periodPackage';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import {
  createPeriodPackageSchema,
  findPeriodPackageByIdSchema,
  updatePeriodPackageSchema,
} from '../schemas';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = createPeriodPackageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const validatedData = validationResult.data;
    // Prepare data with proper reference
    const periodPackageData: PeriodPackage = {
      pkg: validatedData.pkg as unknown as ObjectId,
      booked: validatedData.booked,
      maxBook: validatedData.maxBook,
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
    };

    const periodPackage = await periodPackageService.create(periodPackageData);
    if (periodPackage) {
      return appExpress.response201(periodPackage);
    }
    throw new Error('Invalid period package data');
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
    const validationResult = findPeriodPackageByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const periodPackage = await periodPackageService.findById(id);
    if (periodPackage) {
      return appExpress.response200(periodPackage);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const update: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate request body and ID
    const updateData = { ...req.body, _id: req.params.id };
    const validationResult = updatePeriodPackageSchema.safeParse(updateData);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const data: Partial<PeriodPackage> = req.body;

    // Convert string ID to ObjectId if present
    if (data.pkg && typeof data.pkg === 'string') {
      data.pkg = new mongoose.Types.ObjectId(data.pkg) as any;
    }

    const periodPackage = await periodPackageService.update(id, data);
    if (periodPackage) {
      return appExpress.response200(periodPackage);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const incrementBooked: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the ID parameter
    const validationResult = findPeriodPackageByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const periodPackage = await periodPackageService.incrementBooked(id);
    if (periodPackage) {
      return appExpress.response200(periodPackage);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

export default {
  create,
  findById,
  update,
  incrementBooked,
};
