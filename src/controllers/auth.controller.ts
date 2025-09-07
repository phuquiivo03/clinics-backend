import type { RequestHandler } from 'express';
import { otpService, userService } from '../services/index.service';
import UtilsService from '../services/utils.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import redisClient from '../db/redis_connection';
import { config } from '../config';
import { registerSchema, verifyOTPSchema } from '../schemas/authen';
import { ZodError } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { IAuthenJWT } from '../types';
import { Resend, type CreateEmailResponseSuccess } from 'resend';
import otp from '../models/otp';

// Register User
const registerUser: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const userRequest = UtilsService.validateBody<{ email: string }>(
      registerSchema,
      req.body,
    );
    if (userRequest instanceof ZodError) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: userRequest.message,
      });
      return;
    }
    const email: string = userRequest.email;
    //check if phone number already exists
    const user = await userService.findOne({ filter: { email } });
    if (user && user.password) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: 'Email already exists',
      });
      return;
    }
    // create OTP
    const createdOtp = await otpService.create(email);
    if (!createdOtp) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
      return;
    }


    // send OTP to phone number
    // await twilioService.sendSMS(formatPhoneNumber, `Your OTP is ${createdOtp?.code}`);
    const sendOtpResult = await sendOtp(email,`${createdOtp?.code}`)
    if(!sendOtpResult){
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {message: 'Failed to send OTP'});
    }
    appExpress.response201({ message: 'OTP created: ' + createdOtp?.code });
  } catch (e) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {});
  }
};

const verifyOTP: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const userRequest = UtilsService.validateBody<{ email: string; code: string }>(
      verifyOTPSchema,
      req.body,
    );
    if (userRequest instanceof ZodError) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: userRequest.message,
      });
      return;
    }
    const { email, code } = userRequest;
    const isValid = await otpService.verify(email, code);
    if (!isValid) {
      appExpress.response400(ErrorCode.OTP_INVALID, {});
      return;
    }
    // create cache for email
    const cacheKey = config.redis.key.emailVerified(email);
    await redisClient.set(cacheKey, 'true', { EX: config.redis.cache.emailVerified });
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
      // generate new token
      const { authenToken, refreshToken } = UtilsService.generateToken(result._id.toString());
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

const sendOtp = async (to: string, otp: string): Promise<CreateEmailResponseSuccess> => {
  const resend = new Resend(config.resend.apiKey);
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'OTP Verification',
    html: `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>OTP Verification</title>
<meta name="color-scheme" content="light dark"/>
<style>
  body { margin:0; background:#f6f7fb; font-family:-apple-system, Segoe UI, Roboto, Arial, sans-serif; padding:24px; }
  .container { max-width:640px; margin:0 auto; background:#fff; border-radius:14px; padding:24px; }
  h1 { margin:0 0 8px; font-size:20px; }
  p { margin:0 0 12px; line-height:1.6; color:#333; }
  .otp { font-size:28px; letter-spacing:.35em; font-weight:700; background:#f2f3f7; padding:12px 16px; border-radius:10px; display:inline-block; }
  .btn { display:inline-block; padding:12px 18px; border-radius:10px; text-decoration:none; background:#111; color:#fff; font-weight:600; }
  .muted { color:#666; font-size:12px; }
  .divider { height:1px; background:#e9e9ef; margin:16px 0; }
  code { background:#f2f3f7; padding:2px 6px; border-radius:6px; }
  @media (prefers-color-scheme: dark) {
    body { background:#0b0b0c; }
    .container { background:#161618; }
    p, .muted { color:#ddd; }
    .otp { background:#1f2023; color:#fff; }
    .btn { background:#eaeaea; color:#111; }
    .divider { background:#2a2a2e; }
    code { background:#1f2023; color:#fff; }
  }
</style>
</head>
<body>
  <div class="container">
    <h1 style="
    color:#000;
  ">Xác thực đăng nhập</h1>
    <p>Mã OTP của bạn:</p>
    <div style="
    background:#24ae7c; 
    color:#fff;
  " class="otp" aria-label="Mã OTP">${otp}</div>
    <p>Mã sẽ <strong>hết hạn sau 5 phút</strong>. </p>
    <div class="divider"></div>
    <div class="divider"></div>
    <p class="muted">Vì lý do bảo mật, <strong>không chia sẻ</strong> mã này cho bất kỳ ai (kể cả người tự xưng là nhân viên).</p>
    <p class="muted">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email hoặc liên hệ hỗ trợ: <a href="mailto: wemicallabs@gmail.com">wemicallabs@gmail.com</a>.</p>
  </div>
</body>
</html>`
  });

  if (error) throw new Error(error.message);
  return data;
}

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

const changePassword: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: 'Old password and new password are required.',
      });
      return;
    }
    const userId = req.user._id.toString();
    const user = await userService.findById(userId);
    if (!user) {
      appExpress.response404(ErrorCode.NOT_FOUND, {
        message: 'User not found.',
      });
      return;
    }
    const isPasswordValid = await userService.verifyPassword(user, oldPassword);
    if (!isPasswordValid) {
      appExpress.response400(ErrorCode.UNAUTHORIZED, {
        message: 'Old password is incorrect.',
      });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    const updatedUser = await userService.findAndUpdate(userId, { password: hashedPassword });
    if (!updatedUser) {
      appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
        message: 'Failed to update password.',
      });
      return;
    }
    appExpress.response200({ message: 'Password changed successfully.' });
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
      error: (error as Error).message,
    });
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const requestRefreshToken: string | undefined = req.body.refreshToken;
    // Assuming req.user and req.user._id are populated by upstream authentication middleware
    // If not, this will throw an error. Robust code would check req.user.

    if (!requestRefreshToken) {
      appExpress.response400(ErrorCode.MISSING_REFRESH_TOKEN, {
        message: 'Refresh token is required in the request body.',
      });
      return;
    }

    const decoded = jwt.verify(requestRefreshToken, config.jwt.authen.secret) as IAuthenJWT;
    if (decoded.expired < Date.now()) {
      appExpress.response400(ErrorCode.TOKEN_EXPIRED, {});
      return;
    }

    const userId = decoded.id.toString();

    console.log('REFRESH_TOKEN::DECODED', decoded);

    const activeRefreshTokenKey = config.redis.key.refreshToken(userId);
    const usedRefreshTokensSetKey = config.redis.key.usedRefreshTokensSet(userId);
    const usedTokenTTL = config.redis.cache.usedRefreshTokenTTL;

    // 1. Check for refresh token reuse (replay attack detection)
    const isTokenReused = await redisClient.sIsMember(usedRefreshTokensSetKey, requestRefreshToken);
    if (isTokenReused) {
      console.warn(
        `SECURITY_ALERT: Replay of used refresh token detected for user ${userId}. Invalidating all sessions.`,
      );
      // Invalidate all refresh tokens for this user by deleting the active one and the used set
      await redisClient.del(activeRefreshTokenKey);
      await redisClient.del(usedRefreshTokensSetKey);
      // Respond with an error indicating session invalidation. Client must re-authenticate.
      appExpress.response400(ErrorCode.SESSION_INVALIDATED, {
        message:
          'Your session has been invalidated due to suspicious activity. Please log in again.',
      });
      return;
    }

    // 2. Get the currently stored active refresh token for the user
    const storedActiveToken = await redisClient.get(activeRefreshTokenKey);

    // 3. Validate the presented token against the active one
    if (!storedActiveToken || storedActiveToken !== requestRefreshToken) {
      // This means the token is invalid, expired (and removed from Redis), or doesn't match.
      // It could also happen if an attacker used the valid token, it got rotated,
      // and the legitimate user is now presenting the (now old) token.
      // The `isTokenReused` check above handles the more direct replay.
      appExpress.response400(ErrorCode.INVALID_REFRESH_TOKEN, {
        message: 'Invalid or expired refresh token. Please log in again.',
      });
      return;
    }

    // 4. Token is valid and active. Proceed with rotation.
    // Add the current token (requestRefreshToken) to the "used" list with a short TTL.
    await redisClient.sAdd(usedRefreshTokensSetKey, requestRefreshToken);
    await redisClient.expire(usedRefreshTokensSetKey, usedTokenTTL); // Set/update TTL on the set

    // 5. Generate new authentication and refresh tokens
    const { authenToken: newAuthenToken, refreshToken: newRefreshToken } =
      UtilsService.generateToken(userId);

    // 6. Store the new refresh token as the active one, with its standard expiry
    await redisClient.set(activeRefreshTokenKey, newRefreshToken, {
      EX: config.redis.cache.refreshToken, // Standard expiry for the new active refresh token
    });

    // 7. Send the new tokens to the client
    appExpress.response200({ authenToken: newAuthenToken, refreshToken: newRefreshToken });
  } catch (error) {
    appExpress.response500(ErrorCode.INTERNAL_SERVER_ERROR, {
      message: (error as Error).message || 'An unexpected error occurred while refreshing token.',
    });
  }
};

export default {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  refreshToken,
  changePassword,
};
