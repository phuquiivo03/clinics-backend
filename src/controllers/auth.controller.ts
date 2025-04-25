import type { RequestHandler } from 'express';
import { otpService, userService } from '../services/index.service';
import UtilsService from '../services/utils.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import redisClient from '../db/redis_connection';
import { config } from '../config';
import { registerSchema, verifyOTPSchema } from '../schemas/authen';
import { ZodError } from 'zod';

// Register User
const registerUser: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const userRequest = UtilsService.validateBody<{ phoneNumber: string }>(
      registerSchema,
      req.body,
    );
    if (userRequest instanceof ZodError) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: userRequest.message,
      });
      return;
    }
    const phoneNumber: string = userRequest.phoneNumber;
    //check if phone number already exists
    const user = await userService.findOne({ filter: { phoneNumber } });
    if (user) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: 'Phone number already exists',
      });
      return;
    }
    // create OTP
    const createdOtp = await otpService.create(phoneNumber);
    if (!createdOtp) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
      return;
    }

    appExpress.response201({ message: 'OTP created: ' + createdOtp?.code });
  } catch (e) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
  }
};

const verifyOTP: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const userRequest = UtilsService.validateBody<{ phoneNumber: string; code: string }>(
      verifyOTPSchema,
      req.body,
    );
    if (userRequest instanceof ZodError) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: userRequest.message,
      });
      return;
    }
    const { phoneNumber, code } = userRequest;
    const isValid = await otpService.verify(phoneNumber, code);
    if (!isValid) {
      appExpress.response401(ErrorCode.OTP_INVALID, {});
      return;
    }
    // create cache for phone number
    const cacheKey = config.redis.key.phoneNumberVerified(phoneNumber);
    await redisClient.set(cacheKey, 'true', { EX: config.redis.cache.phoneNumberVerified });
    appExpress.response201({ message: 'OTP verified!' });
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
  }
};

// Login User
const loginUser: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const { phoneNumber, password } = req.body;

    const result = await userService.login(phoneNumber, password);
    if (result._id) {
      const authenToken = UtilsService.generateToken(result._id.toString());

      appExpress.response200({ ...userService.userWithoutPassword(result), authenToken });
      return;
    } else {
      appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {});
      return;
    }
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { message: (error as Error).message });
  }
};

export default {
  registerUser,
  verifyOTP,
  loginUser,
};
