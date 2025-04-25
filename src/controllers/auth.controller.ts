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
      // remove old refresh token
      const oldToken = await redisClient.get(config.redis.key.refreshToken(result._id.toString()));
      await redisClient.del(config.redis.key.refreshToken(result._id.toString()));
      console.log('LOGIN::OLD_REFRESH_TOKEN', oldToken);
      // generate new token
      const { authenToken, refreshToken } = UtilsService.generateToken(result._id.toString());
      console.log('LOGIN::NEW_REFRESH_TOKEN', refreshToken);
      await redisClient.set(
        config.redis.key.refreshToken(result._id as unknown as string),
        refreshToken,
        { EX: config.redis.cache.refreshToken },
      );
      appExpress.response200({
        ...userService.userWithoutPassword(result),
        authenToken,
        refreshToken,
      });
      return;
    } else {
      appExpress.response400(ErrorCode.INVALID_REQUEST_BODY, {});
      return;
    }
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, { message: (error as Error).message });
  }
};

const logoutUser: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // remove refresh token
    await redisClient.del(config.redis.key.refreshToken(req.user._id.toString()));
    // blacklist authen token
    await redisClient.set(config.redis.key.authenToken(req.authenToken as string), `true`, {
      EX: config.redis.cache.authenToken,
    });
    appExpress.response200({ message: 'Logout successfully' });
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
      error: (error as Error).message,
    });
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const requestRefreshToken = req.body.refreshToken;
    const token = await redisClient.get(config.redis.key.refreshToken(req.user._id.toString()));
    if (token !== requestRefreshToken) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: 'Invalid refresh token',
      });
      return;
    }
    const { authenToken, refreshToken } = UtilsService.generateToken(req.user._id.toString());
    await redisClient.set(config.redis.key.refreshToken(req.user._id.toString()), refreshToken, {
      EX: config.redis.cache.refreshToken,
    });
    appExpress.response200({ authenToken, refreshToken });
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
      message: (error as Error).message,
    });
  }
};

export default {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  refreshToken,
};
