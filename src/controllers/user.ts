import jwt from 'jsonwebtoken';
import { z } from 'zod';
import type { RequestHandler } from 'express';
import { ROLE, type User } from '../types';
import { otpService, userService } from '../services';
import { createUserSchema, updateUserInfoSchema } from '../schemas';
import type { ICreateUserRequest, IUpdateUserInfoRequest } from '../dto/user';
import UtilsService from '../services/utils';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';

const createUser: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  // const { phoneNumber, verified} = req.session;
  // if (!phoneNumber || !verified) {
  //   res.status(400).json({ message: 'Phone number not found or not verified' });
  //   return;
  // }
  try {
    // Validate request body against schema
    const validationResult = createUserSchema.safeParse(req.body);

    if (!validationResult.success) {
      appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, validationResult.error);
      return;
    }

    const userRequest: ICreateUserRequest = validationResult.data;
    const data: User = {
      ...userRequest,
      // phoneNumber,
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
    // @ts-ignore
    const authenToken = UtilsService.generateToken(result._id.toString());
    // res.cookie("authenToken", authenToken, {
    //   maxAge: config.cookie.maxAge,
    //   signed: true,
    // })

    appExpress.response201({
      user: userService.userWithoutPassword(result),
      authenToken,
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

    const userRequest: IUpdateUserInfoRequest = validationResult.data;
    const user = await userService.findById(req.user._id);
    if (!user) {
      appExpress.response404(ErrorCode.NOT_FOUND, {});
      return;
    }
    const updatedUser = await userService.findAndUpdate(req.user._id, {
      ...userRequest,
      phoneNumber: req.user.phoneNumber,
      role: req.user.role,
    });
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

export default {
  getUserProfile,
  createUser,
  updateUserProfile,
};
