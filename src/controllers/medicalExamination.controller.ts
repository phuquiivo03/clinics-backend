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
    const { page = 1, limit = 10 } = req.query;
    const requestOptionsString = req.query.options as string;
    let requestOptions: MongooseFindManyOptions = {};
    let pageOptions: MongooseFindManyOptions = {
      pagination: {
        page: Number(page),
        limit: Number(limit),
      },
    };

    try {
      if (requestOptionsString) {
        requestOptions = JSON.parse(requestOptionsString);
      }

      const results = await this.service.findMany({
        ...requestOptions,
        ...pageOptions,
      });
      return appExpress.response200(results);
    } catch (error) {
      if (error instanceof SyntaxError) {
        return appExpress.response400(ErrorCode.BAD_REQUEST, {
          message: 'Invalid options format: ' + error.message,
        });
      }
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
