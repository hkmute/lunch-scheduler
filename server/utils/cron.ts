import cron from 'node-cron';
import { InternalController } from '../controllers/internalController';
import { knex } from '../routes';
import { InternalService } from '../services/internalService';

export const scheduleTask = () => {
  cron.schedule(
    '* * 9 * *',
    async () => {
      try {
        const service = InternalService(knex);
        const controller = InternalController(service);
        await controller.generateOptions();
        console.log(`${new Date()}: Generated options successfully`);
      } catch (err) {
        console.log(`${new Date()}: Generated options failed`);
      }
    },
    { timezone: 'Asia/Hong_Kong' }
  );
  console.log('Generate today options task is scheduled');

  cron.schedule(
    '* * 12 * *',
    async () => {
      try {
        const service = InternalService(knex);
        const controller = InternalController(service);
        const votes = await controller.getTodayVotes();
        await controller.generateResults(
          votes as {
            optionId: number;
            codeId: number;
            count: number;
          }[]
        );
        console.log(`${new Date()}: Generated results successfully`);
      } catch (err) {
        console.log(`${new Date()}: Generated results failed`);
      }
    },
    { timezone: 'Asia/Hong_Kong' }
  );
  console.log('Generate results task is scheduled');
};
