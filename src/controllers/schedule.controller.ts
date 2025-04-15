import type { RequestHandler } from 'express';
import { periodPackageService, scheduleService } from '../services/index.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { createScheduleSchema, findScheduleByIdSchema } from '../schemas';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = createScheduleSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }
    // Add date conversion
    const scheduleData: any = validationResult.data;
    scheduleData.date = new Date(scheduleData.date);
    // create transaction

    const session = await mongoose.startSession();

    try {
      // Start the transaction
      session.startTransaction();

      // Create schedule
      const schedule = await scheduleService.create(
        { ...scheduleData, userId: req.user.id },
        session,
      );

      if (!schedule) {
        await session.abortTransaction();
        return appExpress.response404(ErrorCode.NOT_FOUND, {
          message: 'Schedule not found',
        });
      }

      const periodPkgId: ObjectId = scheduleData.packagePeriodId as unknown as ObjectId;
      const periodPkg = await periodPackageService.findById(periodPkgId, { session });

      if (!periodPkg) {
        await session.abortTransaction();
        return appExpress.response404(ErrorCode.NOT_FOUND, {
          message: 'Period package not found',
        });
      }
      if (periodPkg.booked >= periodPkg.maxBook) {
        await session.abortTransaction();
        return appExpress.response400(ErrorCode.BAD_REQUEST, {
          message: 'Period package is full',
        });
      }

      periodPkg.booked += 1;
      const updatedPeriodPkg = await periodPackageService.update(periodPkgId, periodPkg, {
        session,
      });

      if (!updatedPeriodPkg) {
        await session.abortTransaction();
        return appExpress.response400(ErrorCode.BAD_REQUEST, {
          message: 'Failed to update period package',
        });
      }

      // If we get here, everything succeeded
      await session.commitTransaction();
      return appExpress.response201(schedule);
    } catch (error: any) {
      // If there's an error, abort the transaction
      await session.abortTransaction();

      // Handle specific error types
      if (error.message === 'Period package not found') {
        return appExpress.response404(ErrorCode.NOT_FOUND, {
          message: 'Period package not found',
        });
      } else if (error.message === 'Failed to update period package') {
        return appExpress.response400(ErrorCode.BAD_REQUEST, {
          message: 'Failed to update period package',
        });
      } else if (error.message === 'Schedule not found') {
        return appExpress.response404(ErrorCode.NOT_FOUND, {
          message: 'Schedule not found',
        });
      }

      // Generic error handling
      return appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
        message: error.message,
      });
    } finally {
      // Always end the session
      await session.endSession();
    }
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

// Add a method to find schedules by user ID
const findByUserId: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const userId = req.params.userId;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {});
    }

    const objectId: ObjectId = userId as unknown as ObjectId;
    const schedules = await scheduleService.findByUserId(objectId);
    return appExpress.response200(schedules);
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
    const validationResult = findScheduleByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const schedule = await scheduleService.findById(id);
    if (schedule) {
      return appExpress.response200(schedule);
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
  findByUserId,
};
