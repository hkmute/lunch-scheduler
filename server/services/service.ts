import { Knex } from 'knex';
import { Options, History, OptionList, Code, OptionInList } from './model';

export class Service {
  constructor(private knex: Knex) {}

  getOptions = async () => {
    return await this.knex<Options>('options').select('id', 'name');
  };

  getHistoryByCode = async (code: string) => {
    return await this.knex<History>('history')
      .join('code', 'history.code_id', 'code.id')
      .join('options', 'history.option_id', 'options.id')
      .select('history.id', 'history.date', 'options.name')
      .where('code.code', code);
  };
}

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
      const res = await knex<OptionList[]>('option_list')
        .select()
        .where('code', code)
        .join<Code>('code', 'code.option_list_id', 'option_list.id')
        .join<OptionInList>('option_in_list', 'option_in_list.option_list_id', 'option_list.id')
        .join<Options>('options', 'options.id', 'option_in_list.option_id')
        .select(
          knex.ref('id').withSchema('option_list'),
          knex.ref('name').withSchema('option_list'),
          knex.raw("CONCAT('[',GROUP_CONCAT( JSON_OBJECT('optionId', ?, 'optionName', ?)),']') AS 'details'", [
            knex.ref('id').withSchema('options'),
            knex.ref('name').withSchema('options'),
          ])
        )
        .groupBy('id');
      //@ts-ignore
      return res.map((row) => ({ ...row, details: JSON.parse(row.details) }));
    },
  });
}
