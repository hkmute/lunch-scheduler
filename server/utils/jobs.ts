import { knex } from '../routes';
import { InternalController } from '../controllers/internalController';
import { InternalService } from '../services/internalService';

export const generateOptions = async () => {
  try {
    const service = InternalService(knex);
    const controller = InternalController(service);
    await controller.generateOptions();
    console.log(`${new Date()}: Generated options successfully`);
  } catch (err) {
    console.log(`${new Date()}: Generated options failed`);
  }
};

export const generateResults = async () => {
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
};
