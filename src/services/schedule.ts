import { type ObjectId } from "mongoose";
import scheduleRepository from "../repositories/schedule";
import type { Schedule } from "../types/schedules";
import type { MongooseFindOneOptions } from "../repositories/type";

class ScheduleService {
    async create(data: Partial<Schedule>): Promise<Schedule | null> {
        try {
            const schedule = await scheduleRepository.create(data);
            if (schedule) {
                return schedule;
            }
            throw new Error('Invalid schedule data');
        } catch (error) {
            throw error;
        }
    }

    async findById(id: ObjectId, options?: MongooseFindOneOptions): Promise<Schedule | null> {
        try {
            return scheduleRepository.findById(id, options);
        } catch (error) {
            throw error;
        }
    }
}

const scheduleService = new ScheduleService();
export default scheduleService; 