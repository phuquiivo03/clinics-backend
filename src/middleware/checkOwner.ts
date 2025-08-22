import type { NextFunction, Request, Response } from 'express';
import { CustomExpress } from '../pkg/app/response';
import { userModel, doctorModel, scheduleModel } from '../models';
import WaitingMessageModel from '../models/waitingMessage';
import type { Model } from 'mongoose';
import { ErrorCode } from '../pkg/e/code';
import type { ROLE } from '../types';
export enum ModelRelate {
  USER = 'user',
  DOCTOR = 'doctor',
  SCHEDULE = 'schedule',
  WAITING_MESSAGE = 'waitingMessage',
}

const models: { [key in ModelRelate]: Model<any> } = {
  [ModelRelate.USER]: userModel,
  [ModelRelate.DOCTOR]: doctorModel, // Assuming doctor is also a user
  [ModelRelate.SCHEDULE]: scheduleModel, // Assuming schedule is related to user
  [ModelRelate.WAITING_MESSAGE]: WaitingMessageModel,
};

export const checkOwnerOrRole =
  (model: ModelRelate, documentIdField: string, field: string, role: ROLE[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const appExpress = new CustomExpress(req, res, next);
    const user = req.user;
    // check user ownership
    const documentId = req.params[documentIdField];
    if (!documentId) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: 'Document ID is required',
      });
      return;
    }
    const currentModel = models[model];
    if (!currentModel) {
      appExpress.response400(ErrorCode.BAD_REQUEST, {
        message: 'Model not found',
      });
      return;
    }

    const document = await currentModel.findById(documentId);
    if (!document) {
      appExpress.response404(ErrorCode.NOT_FOUND, {
        message: 'Document not found',
      });
      return;
    }
    if (document[field].toString() !== user._id.toString() && !role.includes(user.role)) {
      // Check if the user is the owner or has the required role
      appExpress.response403(ErrorCode.FORBIDDEN, {
        message: 'You do not have permission to access this document',
      });
      return;
    }

    //
    next();
  };
