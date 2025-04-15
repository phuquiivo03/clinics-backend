import type { RequestHandler } from 'express';
import { dayPackageService } from '../services/index.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { DayPackage } from '../types/dayPackage';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import {
  createDayPackageSchema,
  findDayPackageByIdSchema,
  updateDayPackageSchema,
} from '../schemas';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = createDayPackageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const validatedData = validationResult.data;
    // Prepare data with proper reference
    const dayPackageData: DayPackage = {
      dayOffset: validatedData.day_offset,
      periodPkgs: validatedData.period_pkgs.map((id) => id as unknown as ObjectId),
    };

    const dayPackage = await dayPackageService.create(dayPackageData);
    if (dayPackage) {
      return appExpress.response201(dayPackage);
    }
    throw new Error('Invalid day package data');
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
    const validationResult = findDayPackageByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const dayPackage = await dayPackageService.findById(id);
    if (dayPackage) {
      return appExpress.response200(dayPackage);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findByDayPkgId: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const dayPkgId = req.params.dayPkgId;
    if (!dayPkgId || !mongoose.Types.ObjectId.isValid(dayPkgId)) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
        message: 'Invalid day package ID format',
      });
    }

    const objectId = new mongoose.Schema.Types.ObjectId(dayPkgId);
    const dayPackage = await dayPackageService.findByDayPkgId(objectId);
    if (dayPackage) {
      return appExpress.response200(dayPackage);
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
    const validationResult = updateDayPackageSchema.safeParse(updateData);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const data: Partial<DayPackage> = req.body;

    if (data.periodPkgs && Array.isArray(data.periodPkgs)) {
      data.periodPkgs = data.periodPkgs.map((id) => {
        if (typeof id === 'string') {
          return new mongoose.Types.ObjectId(id);
        }
        return id;
      }) as any;
    }

    const dayPackage = await dayPackageService.update(id, data);
    if (dayPackage) {
      return appExpress.response200(dayPackage);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const addPeriodPackage: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const { id, periodPackageId } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
        message: 'Invalid day package ID format',
      });
    }

    if (!periodPackageId || !mongoose.Types.ObjectId.isValid(periodPackageId)) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
        message: 'Invalid period package ID format',
      });
    }

    const dayPackageId = new mongoose.Schema.Types.ObjectId(id);
    const periodPkgId = new mongoose.Schema.Types.ObjectId(periodPackageId);

    const dayPackage = await dayPackageService.addPeriodPackage(dayPackageId, periodPkgId);
    if (dayPackage) {
      return appExpress.response200(dayPackage);
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
  findByDayPkgId,
  update,
  addPeriodPackage,
};
