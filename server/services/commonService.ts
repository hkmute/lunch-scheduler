import { Knex } from 'knex';
import { OptionInList, Options } from './model';

export function CommonService(knex: Knex) {
  return Object.freeze({
    getOptionsByList: async (optionListId: number) => {
      return await knex<OptionInList>('option_in_list')
        .where('option_list_id', optionListId)
        .join<Options>('options', 'options.id', 'option_in_list.option_id')
        .select(knex.ref('option_id').as('id').withSchema('option_in_list'), knex.ref('name').withSchema('options'));
    },

    checkOptionInListDuplicate: async (optionListId: number, optionId: number) => {
      const duplicate = await knex<OptionInList>('option_in_list')
        .where({
          option_list_id: optionListId,
          option_id: optionId,
        })
        .select();
      return !!duplicate.length;
    },
  });
}
