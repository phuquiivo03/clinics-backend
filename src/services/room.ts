import { type ObjectId } from "mongoose";
import roomRepository from "../repositories/room";
import type { Room } from "../types/room";
import type { MongooseFindOneOptions, MongooseFindManyOptions, MongooseUpdateOptions } from "../repositories/type";

class RoomService {
    async create(data: Partial<Room>): Promise<Room | null> {
        try {
            const room = await roomRepository.create(data);
            if (room) {
                return room;
            }
            throw new Error('Invalid room data');
        } catch (error) {
            throw error;
        }
    }

    async createMany(data: Partial<Room[]>): Promise<Room[] | null> {
        try {
            const rooms = await roomRepository.createMany(data);
            if (rooms) {
                return rooms;
            }
            throw new Error('Invalid room data');
        } catch (error) {
            throw error;
        }
    }

    async update(id: ObjectId, data: Partial<Room>, options?: MongooseUpdateOptions): Promise<Room | null> {
        try {
            return roomRepository.update(id, data, options || { new: true });
        } catch (error) {
            throw error;
        }
    }

    async delete(id: ObjectId): Promise<Room | null> {
        try {
            return roomRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async findById(id: ObjectId, options?: MongooseFindOneOptions): Promise<Room | null> {
        try {
            return roomRepository.findById(id, options);
        } catch (error) {
            throw error;
        }
    }

    async findAll(options?: MongooseFindManyOptions): Promise<Room[] | []> {
        try {
            return roomRepository.findAll(options);
        } catch (error) {
            throw error;
        }
    }
}

const roomService = new RoomService();
export default roomService; 