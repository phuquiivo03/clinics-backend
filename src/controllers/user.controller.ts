import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';
import type { RequestHandler } from 'express';
import { ROLE, type User } from '../types';
import { otpService, userService } from '../services/index.service';
import { createUserSchema, unsignupUserSchema, updateUserInfoSchema } from '../schemas';
import type { ICreateUserRequest, IUnsignupUserRequest, IUpdateUserInfoRequest } from '../dto/user';
import UtilsService from '../services/utils.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import { config } from '../config';
import redisClient from '../db/redis_connection';
import pinataService from '../services/pinata.service';
import fs from 'fs';
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';
import mongoose, { type ObjectId } from 'mongoose';
import bcrypt from 'bcryptjs';

const createUser: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate request body against schema
    const userRequest = UtilsService.validateBody<ICreateUserRequest>(createUserSchema, req.body);
    if (userRequest instanceof ZodError) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
        message: userRequest.message,
      });
    }

    // check if phone number is verified
    const cacheKey = config.redis.key.phoneNumberVerified(userRequest.phoneNumber);
    const isVerified = await redisClient.get(cacheKey);
    if (!isVerified) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: 'Phone number is not verified',
      });
      return;
    }
    const user = await userService.findOne({ filter: { phoneNumber: userRequest.phoneNumber } });
    //check if user exist and password is not null
    if (user && user.password) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: 'Phone number already exists',
      });
      return;
    } else if (user && !user.password) {
      // usser account is created by doctor before
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userRequest.password, salt);
      const updatedUser = await userService.findAndUpdate(user._id as ObjectId, {
        password: hashedPassword,
      });
      if (!updatedUser || !updatedUser._id) {
        appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
          message: 'Failed to update password.',
        });
        return;
      }
      const authenToken = UtilsService.generateAuthenToken(updatedUser._id.toString());
      const refreshToken = UtilsService.generateRefreshToken(updatedUser._id.toString());

      appExpress.response201({
        user: userService.userWithoutPassword(updatedUser),
        authenToken,
        refreshToken,
      });
      return;
    }

    const data: User = {
      ...userRequest,
      role: ROLE.NORMAL,
      name: null,
      email: null,
      address: null,
      dateOfBirth: null,
      gender: null,
      occupation: null,
      comparePassword: async () => false, // Provide a default implementation
    };
    const result = await userService.create(data);
    if (!result._id) {
      appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {});
      return;
    }

    const authenToken = UtilsService.generateAuthenToken(result._id.toString());
    const refreshToken = UtilsService.generateRefreshToken(result._id.toString());

    appExpress.response201({
      user: userService.userWithoutPassword(result),
      authenToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

const unsignupUser: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate request body against schema
    const userRequest = UtilsService.validateBody<IUnsignupUserRequest>(
      unsignupUserSchema,
      req.body,
    );
    if (userRequest instanceof ZodError) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
        message: userRequest.message,
      });
    }

    const user = await userService.findOne({ filter: { phoneNumber: userRequest.phoneNumber } });
    if (user) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: 'Phone number already exists',
      });
      return;
    }

    // check if phone number is verified

    const data: User = {
      ...userRequest,
      role: ROLE.NORMAL,
      address: userRequest.address || '',
      dateOfBirth: userRequest.dateOfBirth || null,
      gender: userRequest.gender || null,
      name: userRequest.name || null,
      email: userRequest.email || null,
      occupation: null,
      comparePassword: async () => false, // Provide a default implementation
    };
    const result = await userService.create(data);
    if (!result._id) {
      appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {});
      return;
    }

    const authenToken = UtilsService.generateAuthenToken(result._id.toString());
    const refreshToken = UtilsService.generateRefreshToken(result._id.toString());

    appExpress.response201({
      user: userService.userWithoutPassword(result),
      authenToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

const getUserProfile: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const user = await userService.findById(req.user._id);
    if (!user) {
      appExpress.response404(ErrorCode.NOT_FOUND, {});
      return;
    }

    appExpress.response200(userService.userWithoutPassword(user));
  } catch (error) {
    console.error(error);
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
  }
};

const updateUserProfile: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate request body against schema
    const validationResult = updateUserInfoSchema.safeParse(req.body);

    if (!validationResult.success) {
      appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
        ...validationResult.error,
      });
      return;
    }
    let avatarUrl: string = '';
    if (req.file) {
      const file = new File([fs.readFileSync(req.file.path)], req.file.originalname, {
        type: req.file.mimetype,
      });
      // Upload to Pinata
      const imageUrl = await pinataService.uploadFile(file);
      // Clean up the temporary file
      fs.unlinkSync(req.file.path);
      avatarUrl = `${config.pinata.viewUrl}${imageUrl.cid}`;
    }

    const userRequest: Partial<IUpdateUserInfoRequest> = {
      avatar: avatarUrl || '',
      ...validationResult.data,
    };
    const user = await userService.findById(req.user._id);
    if (!user) {
      appExpress.response404(ErrorCode.NOT_FOUND, {});
      return;
    }
    const updatedUser = await userService.findAndUpdate(req.user._id, userRequest);
    if (!updatedUser || createUser == null) {
      appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {});
      return;
    }
    appExpress.response200(userService.userWithoutPassword(updatedUser));
  } catch (e) {
    res.status(400).json({
      message: (e as Error).message,
    });
  }
};

const getAllUsers: RequestHandler = async (req, res, next) => {
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
        return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
          message: 'Invalid options format. Please provide a valid JSON string.',
        });
      }
    } else {
      // Handle individual query parameters if options is not provided
      const { page = 1, limit = 10, role, name, phoneNumber } = req.query;

      // Build filter object based on query parameters
      const filter: Record<string, any> = {};
      if (role) filter.role = role;
      if (name) filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
      if (phoneNumber) filter.phoneNumber = { $regex: phoneNumber, $options: 'i' };

      options = {
        filter,
        pagination: {
          page: Number(page),
          limit: Number(limit),
        },
        sort: { createdAt: -1 }, // Sort by creation date, newest first
      };
    }

    const result = await userService.findMany(options);
    appExpress.response200(result);
  } catch (error) {
    console.error(error);
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
  }
};

const findOne: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Parse options from query parameter if provided, otherwise use default options
    const { id } = req.params;
    let options: MongooseFindOneOptions = {
      filter: {
        _id: new mongoose.Types.ObjectId(id),
      },
    };

    // If options are provided as a JSON string, parse them
    if (req.query.options) {
      try {
        const optionsInput = JSON.parse(req.query.options as string) as MongooseFindOneOptions;
        options = {
          ...options,
          ...optionsInput,
        };
      } catch (error) {
        return appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {
          message: 'Invalid options format. Please provide a valid JSON string.',
        });
      }
    }
    const userData = await userService.findOne(options);
    if (!userData) {
      appExpress.response404(ErrorCode.NOT_FOUND, {});
      return;
    }

    appExpress.response200(userService.userWithoutPassword(userData));
  } catch (error) {
    console.error(error);
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
  }
};

export default {
  getUserProfile,
  createUser,
  unsignupUser,
  updateUserProfile,
  getAllUsers,
  findOne,
};
