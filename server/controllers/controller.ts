import { Service, ServiceFunction } from '../services/service';
import { Request, Response } from 'express';

export class Controller {
  constructor(private service: Service) {}

  getOptions = async (req: Request, res: Response) => {
    try {
      const options = await this.service.getOptions();
      res.json({ options });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'interval server error' });
    }
  };

  getHistoryByCode = async (req: Request, res: Response) => {
    try {
      const code = req.params.code;
      const history = await this.service.getHistoryByCode(code);
      res.json({ history });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'interval server error' });
    }
  };
}

export function ControllerFunction(service: ReturnType<typeof ServiceFunction>) {
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
  });
}
