import { type ClientSession, type ObjectId } from 'mongoose';
import scheduleRepository from '../repositories/schedule';
import type { Schedule } from '../types/schedules';
import type { MongooseFindManyOptions, MongooseFindOneOptions } from '../repositories/type';
import type { Pagination } from '../types/response';
import type { AppResponse } from '../dto/response';

class ScheduleService {
  async create(data: Partial<Schedule>, session?: ClientSession): Promise<Schedule | null> {
    try {
      const schedule = await scheduleRepository.create(data, session);
      if (schedule) {
        return schedule;
      }
      throw new Error('Invalid schedule data');
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: ObjectId,
    options?: MongooseFindOneOptions,
    session?: ClientSession,
  ): Promise<Schedule | null> {
    try {
      return scheduleRepository.findById(id, options);
    } catch (error) {
      throw error;
    }
  }

  async findMany(options?: MongooseFindManyOptions): Promise<AppResponse<Schedule[]>> {
    try {
      return scheduleRepository.findAll(options);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: ObjectId,
    schedule: Partial<Schedule>,
    session?: ClientSession,
  ): Promise<Schedule | null> {
    try {
      return scheduleRepository.update(id, schedule, { session, new: true });
    } catch (error) {
      throw error;
    }
  }
}

const scheduleService = new ScheduleService();
export default scheduleService;
