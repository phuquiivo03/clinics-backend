import type { RequestHandler } from 'express';
import { packageWeekService } from '../services/index.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { PackageWeek as PackageWeek } from '../types/packageWeek';
import type { ObjectId } from 'mongoose';
import redisClient from '../db/redis_connection';
import mongoose from 'mongoose';
import {
  createPackageWeekSchema,
  findPackageWeekByIdSchema,
  updatePackageWeekSchema,
} from '../schemas';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = createPackageWeekSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const validatedData = validationResult.data;
    // Prepare data with proper references
    const packageWeekData: any = {
      startDate: new Date(validatedData.startDate),
      endDate: new Date(validatedData.endDate),
      packageDays: validatedData.packageDays.map((id) => new mongoose.Types.ObjectId(id)),
    };

    const packageWeek = await packageWeekService.create(packageWeekData);
    if (packageWeek) {
      return appExpress.response201(packageWeek);
    }
    throw new Error('Invalid package week data');
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
    const validationResult = findPackageWeekByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const packageWeek = await packageWeekService.findById(id);
    if (packageWeek) {
      return appExpress.response200(packageWeek);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findWithFullDetails: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the ID parameter
    const validationResult = findPackageWeekByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const packageWeek = await packageWeekService.findWithFullDetails(id);
    if (packageWeek) {
      return appExpress.response200(packageWeek);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findByDateRangeWithFullDetails: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const { startDate, endDate } = req.params;
    console.log('startDate', startDate);
    if (!startDate || !endDate || typeof startDate !== 'string' || typeof endDate !== 'string') {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_QUERY, {
        message: 'Start date and end date are required',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_QUERY, {
        message: 'Invalid date format',
      });
    }

    const redisKey = `package-weeks-${startDate}-${endDate}`;
    const cachedPackageWeeks = await redisClient.get(redisKey);
    if (cachedPackageWeeks) {
      return appExpress.response200(JSON.parse(cachedPackageWeeks));
    }

    const packageWeeks = await packageWeekService.findByDateRangeWithFullDetails(start, end);
    await redisClient.set(redisKey, JSON.stringify(packageWeeks), {
      EX: 30,
    });
    return appExpress.response200(packageWeeks);
  } catch (error) {
    appExpress.response400(ErrorCode.BAD_REQUEST, {
      message: (error as Error).message,
    });
  }
};

const update: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate request body and ID
    const updateData = { ...req.body, _id: req.params.id };
    const validationResult = updatePackageWeekSchema.safeParse(updateData);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const data: Partial<PackageWeek> = req.body;

    // Convert string dates to Date objects
    if (data.startDate && typeof data.startDate === 'string') {
      data.startDate = new Date(data.startDate);
    }

    if (data.endDate && typeof data.endDate === 'string') {
      data.endDate = new Date(data.endDate);
    }

    // Convert string IDs to ObjectIds
    if (data.packageDays && Array.isArray(data.packageDays)) {
      data.packageDays = data.packageDays.map((id) => {
        if (typeof id === 'string') {
          return new mongoose.Types.ObjectId(id);
        }
        return id;
      }) as any;
    }

    const packageWeek = await packageWeekService.update(id, data);
    if (packageWeek) {
      return appExpress.response200(packageWeek);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const addDayPackage: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const { id, dayPackageId } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
        message: 'Invalid package week ID format',
      });
    }

    if (!dayPackageId || !mongoose.Types.ObjectId.isValid(dayPackageId)) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
        message: 'Invalid day package ID format',
      });
    }

    const packageWeekId = req.params.id as unknown as ObjectId;
    const dayPkgId = req.params.dayPackageId as unknown as ObjectId;

    const packageWeek = await packageWeekService.addDayPackage(packageWeekId, dayPkgId);
    if (packageWeek) {
      return appExpress.response200(packageWeek);
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
  findWithFullDetails,
  findByDateRangeWithFullDetails,
  update,
  addDayPackage,
};
