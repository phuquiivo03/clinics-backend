import type { Request, Response, NextFunction } from 'express';
import { MedicalExaminationResultService } from '../services/medicalExamination.service';
import {
  MedicalExaminationResultCreateSchema,
  MedicalExaminationResultUpdateSchema,
} from '../schemas/medicalExamination';
import type { RequestHandler } from 'express';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { ObjectId, SortOrder } from 'mongoose';
import type { MedicalExaminationResult, SubclinicalResult } from '../types/medicalExamination';
import type { MongooseFindManyOptions } from '../repositories/type';
import waitingMessageService from '../services/waitingMessage.service';
import { WaitingMessageStatus } from '../types/waitingMessage';

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
        services: validatedData.services?.map(serviceId => serviceId as unknown as ObjectId),
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
          limit: 10
        }
      };

      // If options are provided as a JSON string, parse them
      if (req.query.options) {
        try {
          options = JSON.parse(req.query.options as string) as MongooseFindManyOptions;
        } catch (error) {
          return appExpress.response400(ErrorCode.BAD_REQUEST, {
            message: 'Invalid options format. Please provide a valid JSON string.'
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
          hasServices
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
            limit: Number(limit)
          },
          sort: { createdAt: -1 } // Sort by creation date, newest first
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
      const result = await this.service.findById(id);
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
        updateData.services = validatedData.services.map(serviceId => 
          serviceId as unknown as ObjectId
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
          message: 'Your medical examination is complete. Please come to the clinic for the next step.',
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
