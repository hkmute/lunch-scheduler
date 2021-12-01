import { Request, Response } from 'express';
import { SettingService } from '../services/settingService';

export function SettingController(service: ReturnType<typeof SettingService>) {
  return Object.freeze({
    createNewCode: async (req: Request, res: Response) => {
      try {
        const ownerId = req.user;
        const { optionListId } = req.body;
        if (!ownerId || !optionListId) {
          return res.status(400).json({ message: 'Invalid request' });
        }
        const code = await service.createNewCode(ownerId, optionListId);
        if (code) {
          return res.json({ data: { code } });
        }
        return res.status(400).json({ message: 'Invalid request' });
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'internal server error' });
      }
    },

    createNewList: async (req: Request, res: Response) => {
      try {
        const ownerId = 1;
        const { name, optionListIds } = req.body;
        if (!ownerId || typeof name !== 'string' || !Array.isArray(optionListIds)) {
          return res.status(400).json({ message: 'Invalid request' });
        }
        return res.json(await service.createNewList(name, optionListIds));
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'internal server error' });
      }
    },

    editCodeOptionList: async (req: Request, res: Response) => {
      try {
        const ownerId = req.user!;
        const code = req.params.code;
        const { optionIds } = req.body;
        const updated = await service.editCodeOptionList(ownerId, code, optionIds);
        if (updated) {
          return res.json({ message: 'Success' });
        } else if (updated === 0) {
          return res.status(403).json({ message: 'Permission denied' });
        } else {
          return res.status(400).json({ message: 'Invalid request' });
        }
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'internal server error' });
      }
    },

    addOptionListItem: async (req: Request, res: Response) => {
      try {
        const { optionListId, newOption } = req.body;
        if (typeof optionListId !== 'number' || !newOption) {
          return res.status(400).json({ message: 'Invalid request' });
        }
        const inserted = await service.addOptionListItem(optionListId, newOption);
        if (inserted) {
          return res.json({ message: 'Success' });
        }
        return res.status(403).json({ message: 'Duplicated data' });
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'internal server error' });
      }
    },

    removeOptionListItem: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        if (!parseInt(id)) {
          return res.status(400).json({ message: 'Invalid request' });
        }
        const deleted = await service.removeOptionListItem(parseInt(id));
        if (deleted) {
          return res.json({ message: 'Removed successfully' });
        }
        return res.status(400).json({ message: 'Item not exist' });
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'internal server error' });
      }
    },
  });
}
