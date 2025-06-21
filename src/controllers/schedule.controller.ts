import type { RequestHandler } from 'express';
import {
  consultationPackageService,
  periodPackageService,
  scheduleService,
} from '../services/index.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { createScheduleSchema, findBySpecializationSchema, findScheduleByIdSchema } from '../schemas';
import {
  ScheduleServiceStatus,
  ScheduleStatus,
  type Schedule,
  type ScheduleService,
} from '../types/schedules';
import type { MongooseFindManyOptions } from '../repositories/type';
import type { ConsultationService } from '../types';
import { config } from '../config';
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
      session.startTransaction();

      // Create schedule

      const getScheduleData: () => Promise<Schedule> =
        scheduleData.type === 'package'
          ? async (): Promise<Schedule> => {
              const selectedPackage = await consultationPackageService.findOne({
                filter: { _id: scheduleData.packageId as ObjectId },
                populateOptions: {
                  path: 'tests',
                },
              });
              if (selectedPackage == null) {
                throw new Error('Period package not found');
              }

              const services: ScheduleService[] =
                selectedPackage.tests.length > 0
                  ? selectedPackage.tests.map((service) => ({
                      service: (service as ConsultationService)._id as ObjectId,
                      status: ScheduleServiceStatus.PENDING,
                    }))
                  : [];

              return {
                ...scheduleData,
                services,
                userId: req.user.id,
                status: ScheduleStatus.CONFIRMED,
              };
            }
          : async (): Promise<Schedule> => {
              return {
                ...scheduleData,
                services: scheduleData.services.map((svc: string) => {
                  return {
                    service: svc as unknown as ObjectId,
                    status: ScheduleServiceStatus.PENDING,
                  } as ScheduleService;
                }),
                userId: req.user.id,
                status: ScheduleStatus.CONFIRMED,
                packageInfo: config.customPackage as unknown as ObjectId,
              };
            };
      const scheduleDataToCreate = await getScheduleData();
      console.log('scheduleDataToCreate', scheduleDataToCreate);
      const schedule = await scheduleService.create(scheduleDataToCreate, session);
      
      if (!schedule) {
        await session.abortTransaction();
        return appExpress.response404(ErrorCode.NOT_FOUND, {
          message: 'Schedule not found',
        });
      }

      session.commitTransaction();
  

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

const findBySpecialization: RequestHandler = async (req, res, next) => {
      const appExpress = new CustomExpress(req, res, next);
      try {
        const validationResult = findBySpecializationSchema.safeParse(req.query);

        if (!validationResult.success) {
          return appExpress.response400(
            ErrorCode.INVALID_REQUEST_BODY,
            validationResult.error.format(),
          );
        }
        const { specialization, dateRange, timeOffset: timeOffsetStr, dayOffset: dayOffsetStr } = validationResult.data;

        const timeOffset = parseInt(timeOffsetStr, 10);
        const dayOffset = parseInt(dayOffsetStr, 10);
        const extractedDateRange = JSON.parse(dateRange) as [string, string];
        console.log('dateRange', extractedDateRange);
        // Validate dateRange
        const schedules = await scheduleService.findMany({
          filter: {
            'weekPeriod.from': {
              $gte: new Date(extractedDateRange[0] || Date.now()),
            },
            'weekPeriod.to': {
              $lte: new Date(extractedDateRange[1] || Date.now()),
            },
            dayOffset,
            timeOffset,
          },
          populateOptions: {
            path: 'services.service packageInfo',
            
          }
        })

        appExpress.response200(
          schedules.filter((schedule) => {
            return schedule.services.some((service) => {
              return (
                (service.service as ConsultationService).specialization as ObjectId
              ).toString() === specialization;
            });
          }),
        );
      } catch (error) {
        appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
          message: (error as Error).message,
        });
      }
   
  }

export default {
  create,
  findById,
  findByUserId,
  findMany,
  getCurrentWeek,
  findBySpecialization,
};
