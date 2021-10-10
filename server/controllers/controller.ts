import { Service } from '../services/service';
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
