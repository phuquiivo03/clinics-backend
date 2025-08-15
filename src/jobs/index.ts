import { notificationJob } from './notification';

// Start the cron job
class JobScheduler {
  start() {
    console.log('Starting notification job scheduler...');
    notificationJob.start();
  }

  stop() {
    notificationJob.stop();
  }
}

const jobScheduler = new JobScheduler();

export { jobScheduler };
