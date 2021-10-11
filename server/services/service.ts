import { Knex } from 'knex';
import { Options, History } from './model';

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
        .join('code', 'history.code_id', 'code.id')
        .join('options', 'history.option_id', 'options.id')
        .select('history.id', 'history.date', 'options.name')
        .where('code.code', code);
    },
  });
}
