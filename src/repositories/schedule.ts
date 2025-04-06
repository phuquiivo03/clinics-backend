import { scheduleModel } from "../models";
import type { Schedule } from "../types/schedules";
import { BaseRepositoryImpl, type BaseRepository } from "./base";

interface ScheduleRepository extends BaseRepository<Schedule> {}

class ScheduleRepositoryImpl extends BaseRepositoryImpl<Schedule> implements ScheduleRepository {
    constructor() {
        super(scheduleModel);
    }
}

export default new ScheduleRepositoryImpl(); 