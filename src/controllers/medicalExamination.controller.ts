import type { Request, Response, NextFunction } from 'express';
import { MedicalExaminationResultService } from '../services/medicalExamination.service';
import {
  MedicalExaminationAddFollowUpSchema,
  MedicalExaminationResultCreateSchema,
  MedicalExaminationResultUpdateSchema,
} from '../schemas/medicalExamination';
import type { RequestHandler } from 'express';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { ObjectId, SortOrder } from 'mongoose';
import type { MedicalExaminationResult, SubclinicalResult } from '../types/medicalExamination';
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';
import waitingMessageService from '../services/waitingMessage.service';
import { WaitingMessageStatus } from '../types/waitingMessage';
import {
  ScheduleServiceStatus,
  ScheduleStatus,
  type Schedule,
  type SchedulePaymentInfo,
  type ScheduleService,
} from '../types/schedules';
import consultationServiceService from '../services/consultationService.service';
import { config } from '../config';
import { PaymentMethod, PaymentStatus, type Payment } from '../types/payment';
import scheduleService from '../services/schedule.service';
import { PaymentService } from '../services/payment.service';

export class MedicalExaminationResultController {
  private service: MedicalExaminationResultService;

  constructor() {
    this.service = new MedicalExaminationResultService();
  }

  create: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const validatedData = MedicalExaminationResultCreateSchema.parse(req.body);
      if (!validatedData)
        return appExpress.response400(ErrorCode.BAD_REQUEST, {
          message: 'Invalid data',
        });

      const subclinicalResults: SubclinicalResult[] =
        validatedData.subclinicalResults?.map((item) => ({
          ...item,
          service: item.service as unknown as ObjectId,
          performedBy: item.performedBy ? (item.performedBy as unknown as ObjectId) : undefined,
          performedAt: new Date(item.performedAt),
        })) || [];

      const medicalExamData = {
        ...validatedData,
        patient: validatedData.patient as unknown as ObjectId,
        subclinicalResults,
        services: validatedData.services?.map((serviceId) => serviceId as unknown as ObjectId),
        prescription: validatedData.prescription
          ? (validatedData.prescription as unknown as ObjectId)
          : undefined,
      };

      const result = await this.service.create(medicalExamData as MedicalExaminationResult);

      return appExpress.response201(result);
    } catch (error) {
      return appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: (error as Error).message,
      });
    }
  };

  findMany: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);

    try {
      // Parse options from query parameter if provided, otherwise use default options
      let options: MongooseFindManyOptions = {
        sort: { createdAt: -1 }, // Sort by creation date, newest first
        pagination: {
          page: 1,
          limit: 10,
        },
      };

      // If options are provided as a JSON string, parse them
      if (req.query.options) {
        try {
          options = JSON.parse(req.query.options as string) as MongooseFindManyOptions;
        } catch (error) {
          return appExpress.response400(ErrorCode.BAD_REQUEST, {
            message: 'Invalid options format. Please provide a valid JSON string.',
          });
        }
      } else {
        // Handle individual query parameters if options is not provided
        const {
          page = 1,
          limit = 10,
          patient,
          examinationDate,
          startDate,
          endDate,
          prescription,
          hasServices,
        } = req.query;

        // Build filter object based on query parameters
        const filter: Record<string, any> = {};
        if (patient) filter.patient = patient;
        if (examinationDate) filter.examinationDate = examinationDate;
        if (prescription) filter.prescription = prescription;
        if (hasServices === 'true') filter.services = { $exists: true, $not: { $size: 0 } };
        if (hasServices === 'false') filter.services = { $exists: false };

        // Date range filtering based on createdAt
        if (startDate || endDate) {
          filter.createdAt = {};
          if (startDate) filter.createdAt.$gte = new Date(startDate as string);
          if (endDate) filter.createdAt.$lte = new Date(endDate as string);
        }

        options = {
          filter,
          pagination: {
            page: Number(page),
            limit: Number(limit),
          },
          sort: { createdAt: -1 }, // Sort by creation date, newest first
        };
      }

      const results = await this.service.findMany(options);
      return appExpress.response200(results);
    } catch (error) {
      return appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
        message: (error as Error).message,
      });
    }
  };

  findById: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Medical examination ID is required',
        });
      }

      const options: MongooseFindOneOptions = {
        populateOptions: {
          path: 'prescription',
        },
      };
      const result = await this.service.findById(id, options);
      if (!result) {
        return appExpress.response404(ErrorCode.NOT_FOUND, {
          message: 'Medical examination result not found',
        });
      }
      return appExpress.response200(result);
    } catch (error) {
      return appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
        message: (error as Error).message,
      });
    }
  };

  findByPatientId: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { patientId } = req.params;
      if (!patientId) {
        return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Patient ID is required',
        });
      }
      const results = await this.service.findByPatientId(patientId);
      return appExpress.response200(results);
    } catch (error) {
      return appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
        message: (error as Error).message,
      });
    }
  };

  findByUser: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const userId = req.user._id;
      if (!userId) {
        return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'User ID is required',
        });
      }
      const results = await this.service.findMany({
        filter: {
          patient: userId,
        },
      });
      return appExpress.response200(results);
    } catch (error) {
      return appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
        message: (error as Error).message,
      });
    }
  };

  update: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Medical examination ID is required',
        });
      }
      console.log(req.body);
      const validatedData = MedicalExaminationResultUpdateSchema.parse(req.body);
      if (!validatedData) {
        return appExpress.response400(ErrorCode.BAD_REQUEST, {
          message: 'Invalid data',
        });
      }

      // Create a new object to hold the properly typed data
      const updateData: Record<string, any> = {};

      // Copy simple fields
      if (validatedData.examinationDate) updateData.examinationDate = validatedData.examinationDate;
      if (validatedData.symptoms) updateData.symptoms = validatedData.symptoms;
      if (validatedData.followUp) updateData.followUp = validatedData.followUp;
      if (validatedData.finalDiagnosis) updateData.finalDiagnosis = validatedData.finalDiagnosis;

      // Handle ObjectId references
      if (validatedData.patient) {
        updateData.patient = validatedData.patient as unknown as ObjectId;
      }

      if (validatedData.prescription) {
        updateData.prescription = validatedData.prescription as unknown as ObjectId;
      }

      // Handle services array with proper typing
      if (validatedData.services) {
        updateData.services = validatedData.services.map(
          (serviceId) => serviceId as unknown as ObjectId,
        );
      }

      // Handle subclinical results with proper typing
      if (validatedData.subclinicalResults) {
        updateData.subclinicalResults = validatedData.subclinicalResults.map((item) => ({
          ...item,
          service: item.service as unknown as ObjectId,
          performedBy: item.performedBy ? (item.performedBy as unknown as ObjectId) : undefined,
          performedAt: new Date(item.performedAt),
        }));
      }

      const result = await this.service.update(id, updateData as Partial<MedicalExaminationResult>);
      // create message for patient after a week
      //check if all the services are done
      if (result.services.length === result.subclinicalResults.length) {
        const message = await waitingMessageService.create({
          userId: result.patient as unknown as ObjectId,
          message:
            'Your medical examination is complete. Please come to the clinic for the next step.',
          triggerAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: WaitingMessageStatus.PENDING,
        });
        // create message for patient
        // const message = await this.service.createMessage(id);
      }

      return appExpress.response200(result);
    } catch (error) {
      return appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: (error as Error).message,
      });
    }
  };

  addFollowUp: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Medical examination ID is required',
        });
      }
      const validatedData = MedicalExaminationAddFollowUpSchema.parse(req.body);
      if (!validatedData) {
        return appExpress.response400(ErrorCode.BAD_REQUEST, {
          message: 'Invalid data',
        });
      }
      let followup: { notes: string; schedule?: Schedule } = {
        notes: validatedData.notes || '',
      };
      if (validatedData.schedule) {
        // For service type, fetch services to calculate price
        const serviceIds = validatedData.schedule.services || [];
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

        followup.schedule = {
          weekPeriod: {
            from: new Date(validatedData.schedule.weekPeriod.from),
            to: new Date(validatedData.schedule.weekPeriod.to),
          },
          dayOffset: validatedData.schedule.dayOffset,
          timeOffset: validatedData.schedule.timeOffset as 0 | 1,
          services,
          type: 'services',
          userId: validatedData.schedule.userId as unknown as ObjectId,
          status: ScheduleStatus.CONFIRMED,
          packageInfo: config.customPackage as unknown as ObjectId,
          payments: paymentInfo,
        };

        const createdSchedule = await scheduleService.create(followup.schedule);
        if (!createdSchedule) {
          return appExpress.response400(ErrorCode.BAD_REQUEST, {
            message: 'Failed to create schedule',
          });
        }
        console.log('services', createdSchedule.services);
        let amount = 0;
        for (const serviceItem of createdSchedule.services) {
          // Get service details to get the price
          const serviceDetails = await consultationServiceService.findById(
            serviceItem.service as unknown as ObjectId,
          );

          if (serviceDetails) {
            amount += serviceDetails.price || 0;
            // Create a default payment for this service
            const paymentData: Omit<Payment, '_id'> = {
              schedule: createdSchedule._id as ObjectId,
              service: serviceItem.service as ObjectId,
              method: PaymentMethod.CASH,
              amount: serviceDetails.price,
              status: PaymentStatus.PENDING,
              note: '',
              user: req.user.id,
              paymentId: `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              createdAt: new Date(),
            };
            const paymentService = new PaymentService();
            // Create payment record
            const payment = await paymentService.create(paymentData);
            if (payment && payment._id) {
              // Add payment ID to schedule's payments array
              createdSchedule.payments = {
                payments: [],
                totalPrice: 0,
                totalPaid: 0,
              };
              (createdSchedule.payments.payments as ObjectId[]).push(payment._id as ObjectId);
              // schedule.payments.totalPaid += payment.amount;
            }
          }
        }
        createdSchedule.payments.totalPrice = amount;
        // Update the schedule with payment IDs
        if (createdSchedule.payments && createdSchedule.payments.payments.length > 0) {
          await scheduleService.update(createdSchedule._id as ObjectId, {
            payments: createdSchedule.payments,
          });

          followup.schedule._id = createdSchedule._id as unknown as ObjectId;
          const updatedResult = await this.service.update(id, { followUp: followup });
          if (updatedResult) {
            return appExpress.response200(updatedResult);
          }
        }
        return appExpress.response400(ErrorCode.BAD_REQUEST, {
          message: 'Failed to create schedule',
        });
      }
      const updated = await this.service.update(id, { followUp: followup });
      return appExpress.response200(updated);
    } catch (error) {
      return appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: (error as Error).message,
      });
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    const appExpress = new CustomExpress(req, res, next);
    try {
      const { id } = req.params;
      if (!id) {
        return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {
          message: 'Medical examination ID is required',
        });
      }
      await this.service.delete(id);
      return appExpress.response200({ message: 'Medical examination result deleted successfully' });
    } catch (error) {
      return appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
        message: (error as Error).message,
      });
    }
  };
}
