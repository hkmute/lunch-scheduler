import { Knex } from 'knex';
import { Options, History, OptionList, Code, OptionInList } from './model';

export function ServiceFunction(knex: Knex) {
  return Object.freeze({
    getOptions: async () => {
      return await knex<Options>('options').select('id', 'name');
    },

    getHistoryByCode: async (code: string) => {
      return await knex<History>('history')
        .join<Code>('code', 'history.code_id', 'code.id')
        .join<Options>('options', 'history.option_id', 'options.id')
        .select('history.id', 'history.date', 'options.name')
        .where('code.code', code);
    },

    getOptionListByCode: async (code: string) => {
      return await knex<OptionList[]>('option_list')
        .join<Code>('code', 'code.option_list_id', 'option_list.id')
        .select(knex.ref('id').withSchema('option_list'), knex.ref('name').withSchema('option_list'))
        .where('code', code);
    },

    getOptionListDetailsByCode: async (code: string) => {
      const res = await knex<Code>('code')
        .where('code', code)
        .join<OptionList[]>('option_list', 'code.option_list_id', 'option_list.id')
        .join<OptionInList>('option_in_list', 'option_in_list.option_list_id', 'option_list.id')
        .join<Options>('options', 'options.id', 'option_in_list.option_id')
        .select(
          knex.ref('id').withSchema('option_list'),
          knex.ref('name').withSchema('option_list'),
          knex.raw("CONCAT('[',GROUP_CONCAT( JSON_OBJECT('optionId', ?, 'optionName', ?)),']') AS 'details'", [
            knex.ref('id').withSchema('options'),
            knex.ref('name').withSchema('options'),
          ]) as any as Knex.Ref<'details', { details: 'details' }>
        )
        .groupBy('id');
      return res.map((row) => ({ ...row, details: JSON.parse(row.details) }));
    },

    getTodayOptionsByCode: async (code: string) => {
      return await knex<Code>('code')
        .where('code', code)
        .join<History>('today_options', 'today_options.code_id', 'code.id')
        .join<Options>('options', 'options.id', 'today_options.option_id')
        .select('today_options.id', 'today_options.date', 'options.id', 'options.name')
        .whereRaw('today_options.date = CURDATE()');
    },
  });
}
