import cron, { schedule } from 'node-cron';
import scheduleService from '../services/schedule.service';
import UtilsService from '../services/utils.service';
import type { ObjectId } from 'mongoose';
import waitingMessageService from '../services/waitingMessage.service';
import { ScheduleStatus, type Schedule } from '../types/schedules';

// Cron job that runs at 7 PM every day in Ho Chi Minh City timezone (UTC+7)
const cancelSchedulesJob = cron.schedule(
  '0 0 19 * * *',
  async () => {
    console.log('Running daily job at 7 PM Ho Chi Minh City time');

    // Add your job logic here
    await cancelExpiredSchedules();
  },
  {
    timezone: 'Asia/Ho_Chi_Minh',
  },
);

async function cancelExpiredSchedules() {
  try {
    // Your daily task implementation
    console.log('Executing daily cancel task...');
    // Get current date and time
    const currentDate = new Date();
    const { start: startOfCurrentWeek, end: endOfCurrentWeek } =
      UtilsService.getCurrentWeekRange(currentDate);

    const schedules = await scheduleService.findMany({
      filter: {
        'weekPeriod.from': startOfCurrentWeek,
        'weekPeriod.to': endOfCurrentWeek,
        dayOffset: currentDate.getDay() - 1,
      },
    });

    const expiredSchedules: Promise<(Schedule | null)[]> = Promise.all(
      schedules.data.map(async (schedule) => {
        if (schedule.status !== ScheduleStatus.COMPLETED) {
          return scheduleService.update(schedule._id as ObjectId, {
            status: ScheduleStatus.CANCELLED,
          });
        }
        return null;
      }),
    );
    // create all notifications
    await expiredSchedules;
  } catch (error) {
    console.error('Error in daily job:', error);
  }
}

export { cancelSchedulesJob };
