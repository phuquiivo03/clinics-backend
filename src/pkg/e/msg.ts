import { ErrorCode } from './code';

export const ErrorMessages: { [key in ErrorCode]: string } = {
  [ErrorCode.BAD_REQUEST]: 'Bad Request',
  [ErrorCode.UNAUTHORIZED]: 'Unauthorized',
  [ErrorCode.FORBIDDEN]: 'Forbidden',
  [ErrorCode.NOT_FOUND]: 'Not Found',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [ErrorCode.INVALID_REQUEST]: 'Invalid Request',
  [ErrorCode.INVALID_REQUEST_BODY]: 'Invalid Request Body',
  [ErrorCode.INVALID_REQUEST_PARAMS]: 'Invalid Request Params',
  [ErrorCode.INVALID_REQUEST_QUERY]: 'Invalid Request Query',

  [ErrorCode.TOKEN_EXPIRED]: 'Token Expired',
  [ErrorCode.TOKEN_INVALID]: 'Token Invalid',
  [ErrorCode.TOKEN_MISSING]: 'Token Missing',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Insufficient Permissions',
  [ErrorCode.OTP_INVALID]: 'OTP Invalid',
};
