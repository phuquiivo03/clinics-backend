import type { RequestHandler } from 'express';
import { ZodError } from 'zod';
import { blogService, specialtyService } from '../services/index.service';
import {
  createSpecialtyManySchema,
  createSpecialtySchema,
  updateSpecialtySchema,
} from '../schemas/specialty.schema';
import type { ICreateSpecialtyRequest, IUpdateSpecialtyRequest } from '../dto/specialty';
import UtilsService from '../services/utils.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { ObjectId } from 'mongoose';
import type { Specialty } from '../types';
import type { MongooseFindManyOptions } from '../repositories/type';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const specialtyRequest = UtilsService.validateBody<ICreateSpecialtyRequest>(
      createSpecialtySchema,
      req.body,
    );
    if (specialtyRequest instanceof ZodError) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, specialtyRequest);
    }

    const result = await specialtyService.create(specialtyRequest);
    appExpress.response201(result);
  } catch (error) {
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const createMany: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const specialtyRequest: Partial<Specialty[]> = req.body;

    const result = await specialtyService.createMany(specialtyRequest);
    appExpress.response201(result);
  } catch (error) {
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findById: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    if (!req.params.id) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {});
    }
    const id = req.params.id as unknown as ObjectId;
    const specialty = await specialtyService.findById(id);
    const options: MongooseFindManyOptions = {
      filter: {
        specialties: id,
      },
    };
    const blogs = await blogService.findMany(options);
    console.log('SPECIALTIES::BLOGS::OPTIONS', options);
    if (!specialty) {
      return appExpress.response404(ErrorCode.NOT_FOUND, {});
    }
    appExpress.response200({ specialty, blogs });
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
  }
};

const findAll: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const specialties = await specialtyService.findAll();
    appExpress.response200(specialties);
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
  }
};

const update: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const specialtyRequest = UtilsService.validateBody<IUpdateSpecialtyRequest>(
      updateSpecialtySchema,
      req.body,
    );
    if (specialtyRequest instanceof ZodError) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, specialtyRequest);
    }
    if (!req.params.id) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {});
    }

    const updatedSpecialty = await specialtyService.update(
      req.params.id as unknown as ObjectId,
      specialtyRequest,
    );
    if (!updatedSpecialty) {
      return appExpress.response404(ErrorCode.NOT_FOUND, {});
    }
    appExpress.response200(updatedSpecialty);
  } catch (error) {
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const remove: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    if (!req.params.id) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {});
    }
    const result = await specialtyService.delete(req.params.id as unknown as ObjectId);
    if (!result) {
      return appExpress.response404(ErrorCode.NOT_FOUND, {});
    }
    appExpress.response200({ success: true });
  } catch (error) {
    appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

export default {
  create,
  createMany,
  findAll,
  findById,
  update,
  remove,
};
