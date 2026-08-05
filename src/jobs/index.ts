import { notificationJob } from './notification';
import { cancelSchedulesJob } from './updateSchedule'; // Adjust the path if necessary

// Start the cron job
class JobScheduler {
  start() {
    console.log('Starting notification job scheduler...');
    notificationJob.start();
    cancelSchedulesJob.start();
  }

  stop() {
    notificationJob.stop();
    cancelSchedulesJob.stop();
  }
}

const jobScheduler = new JobScheduler();

export { jobScheduler };
