import type { RequestHandler } from 'express';
import { periodPackageService, scheduleService } from '../services/index.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { createScheduleSchema, findScheduleByIdSchema } from '../schemas';
import { ScheduleStatus } from '../types/schedules';
import type { MongooseFindManyOptions } from '../repositories/type';
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
    // scheduleData.date = new Date(scheduleData.date);
    // // create transaction

    const session = await mongoose.startSession();

    try {
      // Start the transaction
      // session.startTransaction();

      // Create schedule
      const schedule = await scheduleService.create(
        {
          ...scheduleData,
          userId: req.user.id,
          status: ScheduleStatus.PENDING,
          packageId: scheduleData.packageId as ObjectId,
        },
        // session,
      );

      if (!schedule) {
        // await session.abortTransaction();
        return appExpress.response404(ErrorCode.NOT_FOUND, {
          message: 'Schedule not found',
        });
      }

      // const periodPkgId: ObjectId = scheduleData.packagePeriodId as unknown as ObjectId;
      // const periodPkg = await periodPackageService.findById(periodPkgId, { session });

      // if (!periodPkg) {
      //   await session.abortTransaction();
      //   return appExpress.response404(ErrorCode.NOT_FOUND, {
      //     message: 'Period package not found',
      //   });
      // }
      // if (periodPkg.booked >= periodPkg.maxBook) {
      //   await session.abortTransaction();
      //   return appExpress.response400(ErrorCode.BAD_REQUEST, {
      //     message: 'Period package is full',
      //   });
      // }

      // periodPkg.booked += 1;
      // const updatedPeriodPkg = await periodPackageService.update(periodPkgId, periodPkg, {
      //   session,
      // });

      // if (!updatedPeriodPkg) {
      //   await session.abortTransaction();
      //   return appExpress.response400(ErrorCode.BAD_REQUEST, {
      //     message: 'Failed to update period package',
      //   });
      // }

      // If we get here, everything succeeded
      // await session.commitTransaction();
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
    console.log('id', id);
    console.log('schedule', schedule);
    appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Schedule not found' });
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findMany: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const schedules = await scheduleService.findMany();
    return appExpress.response200(schedules);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const getCurrentWeek: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const currentWeek = new Date();
    const startOfWeek = new Date(
      currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1),
    );
    const endOfWeek = new Date(
      currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 8),
    );

    // format to vietnam time
    startOfWeek.setHours(7, 0, 0, 0);

    endOfWeek.setHours(6, 59, 59, 999);

    // find all schedules that are in the current week
    const options: MongooseFindManyOptions = {
      filter: {
        'weekPeriod.from': {
          $gte: startOfWeek,
        },
        'weekPeriod.to': {
          $lte: endOfWeek,
        },
      },
    };
    const schedules = await scheduleService.findMany(options);
    // const groupedByDay = new Map<number, Array<{ timeOffset: number; data: any }>>();

    // for (const schedule of schedules) {
    //   if (!groupedByDay.has(schedule.dayOffset)) {
    //     groupedByDay.set(schedule.dayOffset, []);
    //   }
    //   // Assuming schedule objects have dayOffset and timeOffset properties
    //   groupedByDay.get(schedule.dayOffset)!.push({
    //     timeOffset: schedule.timeOffset,
    //     data: schedule,
    //   });
    // }

    // const formattedSchedules = Array.from(groupedByDay.entries())
    //   .map(([dayOffset, times]) => ({
    //     dayOffset,
    //     time: times.sort((a, b) => a.timeOffset - b.timeOffset), // Sort by timeOffset
    //   }))
    //   .sort((a, b) => a.dayOffset - b.dayOffset); // Sort by dayOffset

    const formattedSchedulesNew = [0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
      const times = schedules.filter((schedule) => schedule.dayOffset === dayOffset);
      const timesFormated = [0, 1, 2, 3, 4, 5, 6].map((time) => {
        return {
          timeOffset: time,
          data: times.filter((t) => t.timeOffset === time),
        };
      });
      return {
        dayOffset,
        data: timesFormated || [],
      };
    });
    return appExpress.response200(formattedSchedulesNew);
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
  findMany,
  getCurrentWeek,
};
