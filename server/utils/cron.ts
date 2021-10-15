import cron from 'node-cron';
import { generateOptions, generateResults } from './jobs';

export const scheduleTask = () => {
  cron.schedule('* * 9 * *', generateOptions, { timezone: 'Asia/Hong_Kong' });
  console.log('Generate today options task is scheduled');

  cron.schedule('* * 12 * *', generateResults, { timezone: 'Asia/Hong_Kong' });
  console.log('Generate results task is scheduled');
};
