import type { RequestHandler } from 'express';
import {
  consultationPackageService,
  consultationServiceService,
  doctorService,
  periodPackageService,
  scheduleService,
} from '../services/index.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import {
  createScheduleSchema,
  findBySpecializationSchema,
  findScheduleByIdSchema,
  updateScheduleSchema,
} from '../schemas';
import {
  ScheduleServiceStatus,
  ScheduleStatus,
  type Schedule,
  type ScheduleService,
  type SchedulePaymentInfo,
} from '../types/schedules';
import type { MongooseFindManyOptions } from '../repositories/type';
import type { ConsultationService } from '../types';
import { config } from '../config';
import { PaymentMethod, PaymentStatus, type Payment } from '../types/payment';
import { PaymentService } from '../services/payment.service';

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
    const paymentService = new PaymentService();

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
                throw new Error('  package not found');
              }

              const services: ScheduleService[] =
                selectedPackage.tests.length > 0
                  ? selectedPackage.tests.map((service) => ({
                      service: (service as ConsultationService)._id as ObjectId,
                      status: ScheduleServiceStatus.PENDING,
                    }))
                  : [];

              // Calculate total price from services
              let totalPrice = 0;
              for (const serviceItem of selectedPackage.tests) {
                totalPrice += (serviceItem as ConsultationService).price || 0;
              }

              // Create default payment info
              const paymentInfo: SchedulePaymentInfo = {
                payments: [],
                totalPrice,
                totalPaid: 0,
              };

              return {
                ...scheduleData,
                services,
                userId: req.user.id,
                status: ScheduleStatus.CONFIRMED,
                payments: paymentInfo,
              };
            }
          : async (): Promise<Schedule> => {
              // For service type, fetch services to calculate price
              const serviceIds = scheduleData.services || [];
              const services: ScheduleService[] = serviceIds.map((svc: string) => {
                return {
                  service: svc as unknown as ObjectId,
                  status: ScheduleServiceStatus.PENDING,
                } as ScheduleService;
              });

              // Calculate total price from services
              let totalPrice = 0;
              for (const serviceItem of services) {
                const serviceDetails = await consultationServiceService.findById(
                  serviceItem.service as ObjectId,
                );
                if (serviceDetails) {
                  totalPrice += serviceDetails.price || 0;
                }
              }

              // Create default payment info
              const paymentInfo: SchedulePaymentInfo = {
                payments: [],
                totalPrice,
                totalPaid: 0,
              };

              return {
                ...scheduleData,
                services,
                userId: req.user.id,
                status: ScheduleStatus.CONFIRMED,
                packageInfo: config.customPackage as unknown as ObjectId,
                payments: paymentInfo,
              };
            };

      const scheduleDataToCreate = await getScheduleData();
      const schedule = await scheduleService.create(scheduleDataToCreate, session);

      if (!schedule) {
        await session.abortTransaction();
        return appExpress.response404(ErrorCode.NOT_FOUND, {
          message: 'Schedule not found',
        });
      }

      // Create default payment entries for each service
      for (const serviceItem of schedule.services) {
        // Get service details to get the price
        const serviceDetails = await consultationServiceService.findById(
          serviceItem.service as ObjectId,
        );

        if (serviceDetails) {
          // Create a default payment for this service
          const paymentData: Omit<Payment, '_id'> = {
            schedule: schedule._id as ObjectId,
            service: serviceItem.service as ObjectId,
            method: PaymentMethod.CASH,
            amount: serviceDetails.price,
            status: PaymentStatus.PENDING,
            note: '',
            user: req.user.id,
            paymentId: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            createdAt: new Date(),
          };

          // Create payment record
          const payment = await paymentService.create(paymentData);
          if (payment && payment._id) {
            // Add payment ID to schedule's payments array
            if (!schedule.payments) {
              schedule.payments = {
                payments: [],
                totalPrice: 0,
                totalPaid: 0,
              };
            }
            (schedule.payments.payments as ObjectId[]).push(payment._id as ObjectId);
            schedule.payments.totalPaid += payment.amount;
          }
        }
      }
      // Update the schedule with payment IDs
      if (schedule.payments && schedule.payments.payments.length > 0) {
        await scheduleService.update(
          schedule._id as ObjectId,
          {
            payments: schedule.payments,
          },
          session,
        );
      }

      await session.commitTransaction();

      // If we get here, everything succeeded
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
    const userId = req.user._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {});
    }

    const schedules = await scheduleService.findMany({
      filter: { userId },
    });
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
  const options: MongooseFindManyOptions = JSON.parse(
    (req.query.options as string) || '{}',
  ) as MongooseFindManyOptions;
  console.log('options', options);
  try {
    const schedules = await scheduleService.findMany(options);
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
      const times = schedules.data.filter((schedule) => schedule.dayOffset === dayOffset);
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
    const {
      specialization,
      dateRange,
      timeOffset: timeOffsetStr,
      dayOffset: dayOffsetStr,
      status,
    } = validationResult.data;

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
        status,
      },
      populateOptions: {
        path: 'services.service packageInfo',
      },
    });

    appExpress.response200(
      schedules.data.filter((schedule) => {
        return schedule.services.some((service) => {
          return (
            ((service.service as ConsultationService).specialization as ObjectId).toString() ===
            specialization
          );
        });
      }),
    );
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const update: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = updateScheduleSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }
    const scheduleData = validationResult.data as any;
    const id = req.params.id as unknown as ObjectId;

    // Update schedule
    const updatedSchedule = await scheduleService.update(id, scheduleData);
    if (updatedSchedule) {
      return appExpress.response200(updatedSchedule);
    } else {
      return appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Schedule not found' });
    }
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findByDoctorId: RequestHandler = async (req, res, next) => {
  const doctorId = req.params.id;
  const appExpress = new CustomExpress(req, res, next);

  //tat ca current week current day
  try {
    const currentWeek = new Date();
    const startOfWeek = new Date(
      currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1),
    );
    const endOfWeek = new Date(
      currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 8),
    );

    // get current day offset
    const currentDayOffset: number = new Date().getDay() - 1; // 0 is Sunday, so we subtract 1 to make it 0 for Monday

    // format to vietnam time
    startOfWeek.setHours(7, 0, 0, 0);

    endOfWeek.setHours(6, 59, 59, 999);
    const {
      from = startOfWeek,
      to = endOfWeek,
      dayOffset = currentDayOffset,
      fullWeek = false,
    } = req.query;

    if (!new Date(from as string) || !new Date(to as string)) {
      console.log(from, to);
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
        message: 'Invalid date range',
      });
    }
    console.log(typeof fullWeek)
    const offsetConfig = fullWeek ? {$match: {}} : {$match: {dayOffset: parseInt(dayOffset as string, 10)}};
    console.log(fullWeek,offsetConfig)
    // find all schedules that are in the current week
    const matchOption = {
      $match: {
        'weekPeriod.from': {
          $gte: new Date(from as string),
        },
        'weekPeriod.to': {
          $lte: new Date(to as string),
        },
        
      },
    };

    const result = await doctorService.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(doctorId),
        },
      },
      {
        $lookup: {
          from: 'ConsultationServices',
          localField: 'specialization',
          foreignField: 'specialization',
          as: 'services',
        },
      },
      {
        $addFields: {
          serviceIds: {
            $map: {
              input: '$services',
              as: 'service',
              in: '$$service._id',
            },
          },
        },
      },
      {
        // take schedule which contain the service of doctor
        $lookup: {
          from: 'Schedules',
          let: {
            serviceIds: '$serviceIds',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $size: {
                    $filter: {
                      input: '$services',
                      as: 'schService',
                      cond: {
                        $in: ['$$schService.service', '$$serviceIds'],
                      },
                    },
                  },
                },
              },
            },
            matchOption,
            offsetConfig
          ],
          as: 'schedules',
        },
      },
      {
        $project: {
          schedules: 1,
        },
      },
    ]);

    if (result.length === 0) {
      appExpress.response200([]);
    } else {
      appExpress.response200(result[0].schedules);
    }
  } catch (error) {
    appExpress.response400(ErrorCode.BAD_REQUEST, { message: (error as Error).message });
  }
};
export default {
  create,
  findById,
  findByUserId,
  findMany,
  getCurrentWeek,
  findBySpecialization,
  update,
  findByDoctorId,
};
