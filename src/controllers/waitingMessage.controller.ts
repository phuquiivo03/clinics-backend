import type { RequestHandler } from 'express';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { ObjectId } from 'mongoose';
import mongoose from 'mongoose';
import { waitingMessageService } from '../services/index.service';
import { createWaitingMessageSchema, updateWaitingMessageSchema } from '../schemas';
import type { MongooseFindManyOptions } from '../repositories/type';
import type { WaitingMessageStatus } from '../types/waitingMessage';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = createWaitingMessageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }
    
    // Prepare message data with authenticated user
    const messageData = {
      ...validationResult.data,
      userId: req.user.id,
      triggerAt: new Date(validationResult.data.triggerAt),
    };

    // Create waiting message
    const message = await waitingMessageService.create(messageData);

    return appExpress.response201(message);
  } catch (error: any) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: error.message,
    });
  }
};

const findById: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const id = req.params.id as unknown as ObjectId;
    const message = await waitingMessageService.findById(id);

    if (message) {
      return appExpress.response200(message);
    }
    
    appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Waiting message not found' });
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findByUserId: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const userId = req.user._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return appExpress.response400(ErrorCode.INVALID_REQUEST_PARAMS, {});
    }

    const messages = await waitingMessageService.findMany({
      filter: { userId },
    });
    
    return appExpress.response200(messages);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const findMany: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  const options: MongooseFindManyOptions = JSON.parse(
    (req.query.options as string) || '{}',
  ) as MongooseFindManyOptions;
  
  try {
    const messages = await waitingMessageService.findMany(options);
    return appExpress.response200(messages);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};


// just update status
const update: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const status = req.body.status as WaitingMessageStatus;
    if (!status) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        { message: 'Status is required' },
      );
    }
    
    const id = req.params.id as unknown as ObjectId;

    // Update waiting message
    const message = await waitingMessageService.update(id, { status });
    
    if (message) {
      return appExpress.response200(message);
    }
    
    appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Waiting message not found' });
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

const remove: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const id = req.params.id as unknown as ObjectId;
    const result = await waitingMessageService.delete(id);
    
    if (result) {
      return appExpress.response200({ message: 'Waiting message deleted successfully' });
    }
    
    appExpress.response404(ErrorCode.NOT_FOUND, { message: 'Waiting message not found' });
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {
      message: (error as Error).message,
    });
  }
};

export default {
  create,
  findById,
  findByUserId,
  findMany,
  update,
  remove,
}; 