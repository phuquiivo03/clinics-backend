import type { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ErrorCode } from '../e/code';
import { ErrorMessages } from '../e/msg';

export interface IResponseMethods {
  successResponse(httpCode: StatusCodes, data: object): void;
  errorResponse(httpCode: StatusCodes, errCode: ErrorCode, data: object): void;
  response200(data: any): void;
  response201(data: any): void;
  response400(errCode: ErrorCode, data: object): void;
  response401(errCode: ErrorCode, data: object): void;
  response403(errCode: ErrorCode, data: object): void;
  response404(errCode: ErrorCode, data: object): void;
  response500(errCode: ErrorCode, data: object): void;
}

export class CustomExpress implements IResponseMethods {
  req: Request;
  res: Response;
  next: NextFunction;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
  }

  successResponse(httpCode: StatusCodes, data: object): void {
    let resp: CustomResponse = {
      data,
      msg: ReasonPhrases.OK,
      code: httpCode,
    };
    this.res.status(httpCode).json(resp);
    return;
  }

  errorResponse(httpCode: StatusCodes, errCode: ErrorCode, data: object): void {
    let resp: CustomResponse = {
      data,
      msg: ErrorMessages[errCode],
      code: errCode,
    };
    this.res.status(httpCode).json(resp);
    return;
  }

  response200(data: any): void {
    this.successResponse(StatusCodes.OK, data);
  }

  response201(data: any): void {
    this.successResponse(StatusCodes.CREATED, data);
  }

  response400(errCode: ErrorCode, data: object): void {
    this.errorResponse(StatusCodes.BAD_REQUEST, errCode, data);
  }

  response401(errCode: ErrorCode, data: object): void {
    this.errorResponse(StatusCodes.UNAUTHORIZED, errCode, data);
  }

  response403(errCode: ErrorCode, data: object): void {
    this.errorResponse(StatusCodes.FORBIDDEN, errCode, data);
  }

  response404(errCode: ErrorCode, data: object): void {
    this.errorResponse(StatusCodes.NOT_FOUND, errCode, data);
  }

  response500(errCode: ErrorCode, data: object): void {
    this.errorResponse(StatusCodes.INTERNAL_SERVER_ERROR, errCode, data);
  }
}

export interface CustomResponse {
  data: object;
  msg: string;
  code: number;
}
