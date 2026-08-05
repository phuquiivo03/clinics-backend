import { z } from 'zod';

// Schema for creating a room
export const createRoomSchema = z.object({
  name: z.string().min(1, 'Room name is required'),
  roomNumber: z.number().int().positive('Room number must be a positive integer'),
  roomFloor: z.number().int().min(0, 'Room floor must be a non-negative integer'),
});

// Schema for updating a room
export const updateRoomSchema = createRoomSchema.partial().extend({
  _id: z.string().min(1, 'Room ID is required'),
});

// Schema for finding a room by ID
export const findRoomByIdSchema = z.object({
  id: z.string().min(1, 'Room ID is required'),
});
