import { model, Schema } from 'mongoose';
import type { Room } from '../types/room';

const DOCUMENT = "Room";
const COLLECTION = "Rooms";

const roomSchema = new Schema<Room>(
  {
    name: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: Number,
      required: true,
    },
    roomFloor: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<Room>(DOCUMENT, roomSchema, COLLECTION);
