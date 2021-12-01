import { Knex } from 'knex';
import { Code, OptionInList, OptionList, Options } from './model';
import { nanoid } from 'nanoid/non-secure';
import { logger } from '../utils/logger';
import { CommonService } from './commonService';

export function SettingService(knex: Knex) {
  const commonService = CommonService(knex);
  return Object.freeze({
    createNewCode: async (ownerId: number, optionListId: number) => {
      const code = nanoid(10);
      const inserted = await knex<Code>('code')
        .insert({ owner_id: ownerId, option_list_id: optionListId, code })
        .onConflict()
        .ignore();
      if (inserted[0]) {
        return code;
      }
      return;
    },

    editCodeOptionList: async (ownerId: number, code: string, optionListId: number) => {
      try {
        return await knex<Code>('code').update('option_list_id', optionListId).where({ code, owner_id: ownerId });
      } catch (err) {
        logger.error(err);
        return;
      }
    },

    addOptionListItem: async (optionListId: number, newOption: string) => {
      const existOption = await knex<Options>('options')
        .select(knex.ref('id').withSchema('options'))
        .where('name', newOption)
        .first();
      if (existOption) {
        const isDuplicate = await commonService.checkOptionInListDuplicate(optionListId, existOption.id);
        if (isDuplicate) {
          return 0;
        }
        const linkOption = await knex<OptionInList>('option_in_list').insert({
          option_list_id: optionListId,
          option_id: existOption.id,
        });
        return linkOption[0];
      } else {
        return await knex.transaction(async (trx) => {
          const insertOption = await trx<Options>('options').insert({ name: newOption });
          const linkOption = await trx<OptionInList>('option_in_list').insert({
            option_list_id: optionListId,
            option_id: insertOption[0],
          });
          return linkOption[0];
        });
      }
    },

    removeOptionListItem: async (id: number) => {
      return await knex<OptionInList>('option_in_list').where({ id }).del();
    },

    // createNewList: async (name: string, optionIds: number[]) => {
    //   return await knex.transaction(async (trx) => {
    //     const newListId = await trx<OptionList>('option_list').insert({ name });
    //     const insertedOptions = await trx
    //       .insert(optionIds.map((optionId) => ({ option_id: optionId })))
    //       .into<OptionInList>('option_list')
    //       .where('option_list_id', newListId);
    //   });
    // },
  });
}
