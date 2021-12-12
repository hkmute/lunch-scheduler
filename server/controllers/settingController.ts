import { Request, Response } from 'express';
import { SettingService } from '../services/settingService';

export function SettingController(service: ReturnType<typeof SettingService>) {
  return Object.freeze({
    createNewCode: async function (req: Request, res: Response) {
      try {
        const ownerId = 4;
        const { optionListId, name, optionIds } = req.body;
        if (!ownerId) {
          return res.status(400).json({ message: 'Invalid request' });
        }
        let newListId;
        if (!optionListId) {
          newListId = await service.createNewList(name, optionIds, ownerId);
        }
        const code = await service.createNewCode(ownerId, optionListId || newListId);
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
        const ownerId = 4;
        const { name, optionIds } = req.body;
        if (!ownerId || typeof name !== 'string' || !Array.isArray(optionIds)) {
          return res.status(400).json({ message: 'Invalid request' });
        }
        return res.json(await service.createNewList(name, optionIds, ownerId));
      } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'internal server error' });
      }
    },

    editCodeOptionList: async (req: Request, res: Response) => {
      try {
        const ownerId = req.user;
        const code = req.params.code;
        const { optionListId } = req.body;
        const isOwner = await service.isCodeOwner(ownerId!, code);
        if (!isOwner) {
          return res.status(403).json({ message: 'Permission denied' });
        }
        const updated = await service.editCodeOptionList(ownerId!, code, optionListId);
        if (updated) {
          return res.json({ message: 'Success' });
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
        const ownerId = req.user;
        const { optionListId, newOption } = req.body;
        console.log(ownerId, optionListId, newOption);
        const isOwner = await service.isListOwner(ownerId!, optionListId);
        if (!isOwner) {
          return res.status(403).json({ message: 'Permission denied' });
        }
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
        const ownerId = req.user;
        const { optionListId, optionInListId } = req.body;
        if (!parseInt(optionListId) || !parseInt(optionInListId)) {
          return res.status(400).json({ message: 'Invalid request' });
        }
        const isOwner = await service.isListOwner(ownerId!, parseInt(optionListId));
        if (!isOwner) {
          return res.status(403).json({ message: 'Permission denied' });
        }
        const deleted = await service.removeOptionListItem(parseInt(optionInListId), parseInt(optionListId));
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
