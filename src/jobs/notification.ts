import cron, { schedule } from 'node-cron';
import scheduleService from '../services/schedule.service';
import UtilsService from '../services/utils.service';
import { WaitingMessageStatus, type WaitingMessage } from '../types/waitingMessage';
import type { ObjectId } from 'mongoose';
import waitingMessageService from '../services/waitingMessage.service';

// Cron job that runs at 7 PM every day in Ho Chi Minh City timezone (UTC+7)
const notificationJob = cron.schedule(
  '0 0 19 * * *',
  async () => {
    console.log('Running daily job at 7 PM Ho Chi Minh City time');

    // Add your job logic here
    await notificationsTask();
  },
  {
    timezone: 'Asia/Ho_Chi_Minh',
  },
);

async function notificationsTask() {
  try {
    // Your daily task implementation
    console.log('Executing daily notification task...');
    // Get current date and time
    const currentDate = new Date();
    const { start: startOfCurrentWeek, end: endOfCurrentWeek } =
      UtilsService.getCurrentWeekRange(currentDate);

    const schedules = await scheduleService.findMany({
      filter: {
        'weekPeriod.from': startOfCurrentWeek,
        'weekPeriod.to': endOfCurrentWeek,
        dayOffset: currentDate.getDay() + 1,
      },
    });

    const newNotifications: Promise<WaitingMessage[]> = Promise.all(
      schedules.data.map(async (schedule) => {
        const notification: WaitingMessage = {
          userId: schedule.userId as ObjectId,
          message: `Xin chào bạn, lịch hẹn của bạn vào ngày mai (${schedule.weekPeriod.from.toLocaleDateString()}), hãy sắp xếp đến đúng giờ nhé.`,
          status: WaitingMessageStatus.PENDING,
          triggerAt: currentDate,
        };
        return waitingMessageService.create(notification);
      }),
    );
    // create all notifications
    await newNotifications;
  } catch (error) {
    console.error('Error in daily job:', error);
  }
}

export { notificationJob };
