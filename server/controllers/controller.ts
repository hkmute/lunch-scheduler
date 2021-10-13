import { Service } from '../services/service';
import { Request, Response } from 'express';

export function Controller(service: ReturnType<typeof Service>) {
  return Object.freeze({
    getOptions: async (req: Request, res: Response) => {
      try {
        const options = await service.getOptions();
        res.json({ data: options });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'interval server error' });
      }
    },

    getHistoryByCode: async (req: Request, res: Response) => {
      try {
        const code = req.params.code;
        const history = await service.getHistoryByCode(code);
        res.json({ data: history });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'interval server error' });
      }
    },

    getOptionListByCode: async (req: Request, res: Response) => {
      try {
        const code = req.params.code;
        const optionList = await service.getOptionListByCode(code);
        res.json({ data: optionList });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'interval server error' });
      }
    },

    getOptionListDetailsByCode: async (req: Request, res: Response) => {
      try {
        const code = req.params.code;
        const optionListDetails = await service.getOptionListDetailsByCode(code);
        res.json({ data: optionListDetails });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'interval server error' });
      }
    },

    getTodayOptionsByCode: async (req: Request, res: Response) => {
      try {
        const code = req.params.code;
        const todayOptions = await service.getTodayOptionsByCode(code);
        res.json({ data: todayOptions });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'interval server error' });
      }
    },

    getTodayVoteByCode: async (req: Request, res: Response) => {
      try {
        const code = req.params.code;
        const { user } = req.query;
        const votes = await service.getTodayVoteByCode(code, typeof user === 'string' ? user : '');
        res.json({ data: votes });
      } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'interval server error' });
      }
    },

    postTodayVote: async (req: Request, res: Response) => {
      try {
        const code = req.params.code;
        const { user, optionId } = req.body;
        const votes = await service.postTodayVote(code, user, optionId);
        if (Array.isArray(votes)) {
          return res.json({ data: votes });
        }
        return res.status(votes.code).json({ message: votes.message });
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'interval server error' });
      }
    },
  });
}
