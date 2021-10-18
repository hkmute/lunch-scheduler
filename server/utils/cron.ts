import cron from 'node-cron';
import { generateOptions, generateResults } from './jobs';

export const scheduleTask = () => {
  cron.schedule('0 9 * * *', generateOptions, { timezone: 'Asia/Hong_Kong' });
  console.log('Generate today options task is scheduled');

  cron.schedule('30 11 * * *', generateResults, { timezone: 'Asia/Hong_Kong' });
  console.log('Generate results task is scheduled');
};
