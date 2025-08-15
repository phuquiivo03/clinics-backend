import type { RequestHandler } from 'express';
import { consultationPackageService } from '../services/index.service';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { createConsultationPackageSchema, findConsultationPackageByIdSchema } from '../schemas';
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = createConsultationPackageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const validatedData = validationResult.data;
    console.log(validatedData);
    // Convert test IDs to ObjectIds
    const packageData: any = {
      ...validatedData,
      tests: validatedData.tests.map((id) => new mongoose.Types.ObjectId(id)),
    };

    const consultationPackage = await consultationPackageService.create(packageData);
    if (consultationPackage) {
      return appExpress.response201(consultationPackage);
    }
    throw new Error('Invalid package data');
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const createMany: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const consultationPackages = await consultationPackageService.createMany(req.body);
    if (consultationPackages) {
      return appExpress.response201(consultationPackages);
    }
    throw new Error('Invalid package data');
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const updateMany: RequestHandler = async (req, res, next) => {
  // const appExpress = new CustomExpress(req, res, next);
  // try {
  //   const res = await Promise.all(
  //     data.map(async (row) => {
  //       const options: MongooseFindOneOptions = {
  //         filter: {
  //           icon: row.icon,
  //         },
  //       };
  //       const pkg = await consultationPackageService.findOne(options);
  //       if (pkg) {
  //         consultationPackageService.update(
  //           pkg._id as unknown as ObjectId,
  //           {
  //             subTitle: row.title,
  //           },
  //           {
  //             new: true,
  //           },
  //         );
  //       }
  //       return null;
  //     }),
  //   );
  // } catch (error) {
  //   appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
  //     message: (error as Error).message,
  //   });
  // }
};

const findById: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the ID parameter
    const validationResult = findConsultationPackageByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const consultationPackage = await consultationPackageService.findById(id);
    if (consultationPackage) {
      return appExpress.response200(consultationPackage);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findByIdWithFullDetails: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the ID parameter
    const validationResult = findConsultationPackageByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const consultationPackage = await consultationPackageService.findByIdWithFullDetails(id);
    if (consultationPackage) {
      return appExpress.response200(consultationPackage);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findAll: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const consultationPackages = await consultationPackageService.findAll({
      selectFields: ['title', 'titleImage', 'category', 'price', 'description'],
    });

    appExpress.response200(consultationPackages);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};

const findMany: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);

  try {
    // Parse options from query parameter if provided, otherwise use default options
    let options: MongooseFindManyOptions = {
      sort: { createdAt: -1 }, // Sort by creation date, newest first
      pagination: {
        page: 1,
        limit: 10,
      },
      selectFields: ['title', 'titleImage', 'category', 'price', 'description'],
    };

    // If options are provided as a JSON string, parse them
    if (req.query.options) {
      try {
        console.log('OPTIONS', req.query.options);
        options = JSON.parse(req.query.options as string) as MongooseFindManyOptions;
      } catch (error) {
        return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
          message: 'Invalid options format. Please provide a valid JSON string.',
        });
      }
    } else {
      console.log('NO OPTIONS');
      // Handle individual query parameters if options is not provided
      const { page = 1, limit = 10, title, category, minPrice, maxPrice } = req.query;

      // Build filter object based on query parameters
      const filter: Record<string, any> = {};
      if (title) filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search
      if (category) filter.category = category;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      options = {
        filter,
        pagination: {
          page: Number(page),
          limit: Number(limit),
        },
        sort: { createdAt: -1 }, // Sort by creation date, newest first
        selectFields: ['title', 'titleImage', 'category', 'price', 'description'],
      };
    }

    const consultationPackages = await consultationPackageService.findMany(options);
    appExpress.response200(consultationPackages);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

export default {
  create,
  createMany,
  findById,
  findByIdWithFullDetails,
  findAll,
  findMany,
  updateMany,
};
