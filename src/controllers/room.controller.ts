import type { RequestHandler } from 'express';
import { roomService } from '../services/index.service';
import { CustomExpress } from '../pkg/app/response';
import { ErrorCode } from '../pkg/e/code';
import type { Room } from '../types/room';
import type { ObjectId } from 'mongoose';
import { createRoomSchema, updateRoomSchema, findRoomByIdSchema } from '../schemas';

const create: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body against schema
    const validationResult = createRoomSchema.safeParse(req.body);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const roomData: any = validationResult.data;
    const room = await roomService.create(roomData);
    if (room) {
      return appExpress.response201(room);
    }
    throw new Error('Invalid room data');
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};

const createMany: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const roomsData: Partial<Room[]> = req.body;
    const rooms = await roomService.createMany(roomsData);
    if (rooms) {
      return appExpress.response201(rooms);
    }
    throw new Error('Invalid room data');
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};

const update: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the request body and ID parameter
    const updateData = { ...req.body, _id: req.params.id };
    const validationResult = updateRoomSchema.safeParse(updateData);
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_BODY,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const roomData: any = req.body;
    const room = await roomService.update(id, roomData);
    if (room) {
      return appExpress.response200(room);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};

const deleteRoom: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the ID parameter
    const validationResult = findRoomByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const room = await roomService.delete(id);
    if (room) {
      return appExpress.response200(room);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};

const findById: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    // Validate the ID parameter
    const validationResult = findRoomByIdSchema.safeParse({ id: req.params.id });
    if (!validationResult.success) {
      return appExpress.response400(
        ErrorCode.INVALID_REQUEST_PARAMS,
        validationResult.error.format(),
      );
    }

    const id = req.params.id as unknown as ObjectId;
    const room = await roomService.findById(id);
    if (room) {
      return appExpress.response200(room);
    }
    appExpress.response404(ErrorCode.NOT_FOUND, {});
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};

const findAll: RequestHandler = async (req, res, next) => {
  const appExpress = new CustomExpress(req, res, next);
  try {
    const rooms = await roomService.findAll();
    appExpress.response200(rooms);
  } catch (error) {
    appExpress.response401(ErrorCode.INVALID_REQUEST_BODY, {});
  }
};

export default {
  create,
  createMany,
  update,
  delete: deleteRoom,
  findById,
  findAll,
};
