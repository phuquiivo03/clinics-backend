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
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';
import type { ConsultationService } from '../types';
import { config } from '../config';
import { PaymentMethod, PaymentStatus, type Payment } from '../types/payment';
import { PaymentService } from '../services/payment.service';
import { pipeline } from 'stream';

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
              const totalPrice = selectedPackage.price || 0;
              // for (const serviceItem of selectedPackage.tests) {
              //   totalPrice += (serviceItem as ConsultationService).price || 0;
              // }

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
        return appExpress.response400(ErrorCode.BAD_REQUEST, {
          message: 'Failed to create schedule',
        });
      }

      // Create default payment entries for each service
      if (schedule.type === 'services') {
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
              // schedule.payments.totalPaid += payment.amount;
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
      } else {
        const paymentData: Omit<Payment, '_id'> = {
          schedule: schedule._id as ObjectId,
          // @ts-ignore
          service: schedule.services[0].service as ObjectId,
          method: PaymentMethod.CASH,
          amount: schedule.payments.totalPrice || 0,
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
          if (schedule.payments && schedule.payments.payments.length > 0) {
            await scheduleService.update(
              schedule._id as ObjectId,
              {
                payments: schedule.payments,
              },
              session,
            );
          }
          // schedule.payments.totalPaid += payment.amount;
        }
      }

      // Final validation: Check for orphaned payments in the created schedule
      // This ensures data consistency even if there were any issues during creation
      const finalSchedule = await scheduleService.findById(schedule._id as ObjectId, {
        populateOptions: {
          path: 'payments.payments services.service',
        },
      });

      if (finalSchedule) {
        const scheduleServiceIds = finalSchedule.services.map((s) =>
          (s.service as ObjectId).toString(),
        );
        const orphanedPayments: ObjectId[] = [];
        let orphanedPrice = 0;

        const payments = (finalSchedule.payments?.payments as Payment[]) || [];
        for (const payment of payments) {
          const paymentServiceId = (payment.service as ObjectId).toString();

          if (
            !scheduleServiceIds.includes(paymentServiceId) &&
            payment.status === PaymentStatus.PENDING
          ) {
            orphanedPayments.push(payment._id as ObjectId);
            orphanedPrice += payment.amount;
            await paymentService.delete(payment._id as ObjectId);
          }
        }

        // Update schedule if orphaned payments were found
        if (orphanedPayments.length > 0) {
          const cleanedPaymentIds = (finalSchedule.payments.payments as ObjectId[]).filter(
            (paymentId) => !orphanedPayments.includes(paymentId),
          );

          await scheduleService.update(
            schedule._id as ObjectId,
            {
              payments: {
                payments: cleanedPaymentIds,
                totalPrice: finalSchedule.payments.totalPrice - orphanedPrice,
                totalPaid: finalSchedule.payments.totalPaid,
              },
            },
            session,
          );
        }
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
      return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
        message: error.message,
      });
    } finally {
      // Always end the session
      await session.endSession();
    }
  } catch (error) {
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
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
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
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
    const options: MongooseFindOneOptions = {
      populateOptions: {
        path: 'payments.payments services.service',
      },
    };
    const schedule = await scheduleService.findById(id, options);
    if (schedule) {
      return appExpress.response200(schedule);
    }
    console.log('id', id);
    console.log('schedule', schedule);
    appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Schedule not found' });
  } catch (error) {
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
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
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
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
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
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
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const update: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    console.log(0);
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

    // Start transaction for service and payment updates
    const session = await mongoose.startSession();
    const paymentService = new PaymentService();

    try {
      session.startTransaction();

      // Get current schedule to compare services
      const currentSchedule = await scheduleService.findById(id, {
        populateOptions: {
          path: 'payments.payments services.service',
        },
      });

      if (!currentSchedule) {
        await session.abortTransaction();
        return appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Schedule not found' });
      }

      // Check if services are being updated
      // This handles both adding new services and removing existing services
      // When services are removed, their associated PENDING payments are also removed
      // PAID payments are kept to maintain payment history
      if (scheduleData.services && Array.isArray(scheduleData.services)) {
        // Get current service IDs
        const currentServiceIds = currentSchedule.services.map((s) =>
          (s.service as ObjectId).toString(),
        );

        // Get new service IDs
        const newServiceIds = scheduleData.services;

        // Find newly added services
        const addedServiceIds = newServiceIds.filter(
          (serviceId: string) => !currentServiceIds.includes(serviceId),
        );

        // Find removed services
        const removedServiceIds = currentServiceIds.filter(
          (serviceId: string) => !newServiceIds.includes(serviceId),
        );

        // Update services list - keep existing services that are still in the new list, add new ones
        const updatedServices: ScheduleService[] = [
          // Keep existing services that are still in the new list
          ...currentSchedule.services.filter((s) =>
            newServiceIds.includes((s.service as ObjectId).toString()),
          ),
          // Add new services with default status
          ...addedServiceIds.map((serviceId: string) => ({
            service: serviceId as unknown as ObjectId,
            status: ScheduleServiceStatus.PENDING,
          })),
        ];

        scheduleData.services = updatedServices;
        // Handle payment updates for added and removed services
        // if (addedServiceIds.length > 0 || removedServiceIds.length > 0) {
        //   let additionalPrice = 0;
        //   let removedPrice = 0;
        //   const newPaymentIds: ObjectId[] = [];
        //   const paymentsToRemove: ObjectId[] = [];

        //   // Create payments for new services
        //   for (const serviceId of addedServiceIds) {
        //     const serviceDetails = await consultationServiceService.findById(
        //       serviceId as unknown as ObjectId,
        //     );

        //     if (serviceDetails) {
        //       additionalPrice += serviceDetails.price || 0;

        //       // Create payment record for new service
        //       const paymentData: Omit<Payment, '_id'> = {
        //         schedule: id,
        //         service: serviceId as unknown as ObjectId,
        //         method: PaymentMethod.CASH,
        //         amount: serviceDetails.price,
        //         status: PaymentStatus.PENDING,
        //         note: 'Added service payment',
        //         user: req.user.id,
        //         paymentId: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        //         createdAt: new Date(),
        //       };

        //       const payment = await paymentService.create(paymentData);
        //       if (payment && payment._id) {
        //         newPaymentIds.push(payment._id as ObjectId);
        //       }
        //     }
        //   }

        //   // Update payment information
        //   const currentPayments = currentSchedule.payments || {
        //     payments: [],
        //     totalPrice: 0,
        //     totalPaid: 0,
        //   };

        //   // Filter out removed payments and add new ones
        //   const remainingPaymentIds = (currentPayments.payments as ObjectId[]).filter(
        //     (paymentId) => !paymentsToRemove.includes(paymentId),
        //   );

        //   const updatedPaymentInfo: SchedulePaymentInfo = {
        //     payments: [...remainingPaymentIds, ...newPaymentIds],
        //     totalPrice: currentPayments.totalPrice + additionalPrice - removedPrice,
        //     totalPaid: currentPayments.totalPaid, // Keep current paid amount
        //   };

        //   scheduleData.payments = updatedPaymentInfo;
        // }
      }

      // Check for orphaned payments (payments referencing services not in the schedule)
      // This handles cases where payments exist for services that are no longer in the schedule
      // const finalServiceIds = scheduleData.services
      //   ? scheduleData.services.map((s: any) => (s.service || s).toString())
      //   : currentSchedule.services.map((s) => (s.service as ObjectId).toString());

      // const currentPayments = (currentSchedule.payments?.payments as Payment[]) || [];
      // const orphanedPayments: ObjectId[] = [];
      // let orphanedPrice = 0;

      // for (const payment of currentPayments) {
      //   const paymentServiceId = (payment.service as ObjectId).toString();

      //   // If payment references a service not in the final service list
      //   if (!finalServiceIds.includes(paymentServiceId)) {
      //     // Only remove PENDING payments, keep PAID for audit purposes
      //     if (payment.status === PaymentStatus.PENDING) {
      //       orphanedPayments.push(payment._id as ObjectId);
      //       orphanedPrice += payment.amount;

      //       // Delete the orphaned payment
      //       await paymentService.delete(payment._id as ObjectId);
      //     }
      //   }
      // }

      // Update payment info if orphaned payments were found
      // if (orphanedPayments.length > 0) {
      //   const currentPaymentInfo = scheduleData.payments ||
      //     currentSchedule.payments || {
      //       payments: [],
      //       totalPrice: 0,
      //       totalPaid: 0,
      //     };

      //   // Filter out orphaned payments from the payments array
      //   const cleanedPaymentIds = (currentPaymentInfo.payments as ObjectId[]).filter(
      //     (paymentId) => !orphanedPayments.includes(paymentId),
      //   );

      //   scheduleData.payments = {
      //     payments: cleanedPaymentIds,
      //     totalPrice: currentPaymentInfo.totalPrice - orphanedPrice,
      //     totalPaid: currentPaymentInfo.totalPaid, // Keep paid amount
      //   };
      // }

      // Update schedule with new data
      const updatedSchedule = await scheduleService.update(id, scheduleData, session);

      if (!updatedSchedule) {
        await session.abortTransaction();
        return appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Schedule not found' });
      }

      await session.commitTransaction();
      if (scheduleData.services) {
        await scheduleService.recalculateTotalPaid(id);
      }
      return appExpress.response200(updatedSchedule);
    } catch (error: any) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
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
      fullWeek: fullWeekStr = 'false',
    } = req.query;
    const fullWeek = fullWeekStr === 'true';
    if (!new Date(from as string) || !new Date(to as string)) {
      console.log(from, to);
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
        message: 'Invalid date range',
      });
    }
    const offsetConfig = fullWeek
      ? { $match: {} }
      : { $match: { dayOffset: parseInt(dayOffset as string, 10) } };
    console.log(fullWeek, offsetConfig);
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
          let: {
            specializationId: '$specialization',
            roomId: '$room',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$specialization', '$$specializationId'] },
                    { $eq: ['$room', '$$roomId'] },
                  ],
                },
              },
            },
          ],
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
            offsetConfig,
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
