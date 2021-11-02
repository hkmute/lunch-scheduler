import { format } from 'date-fns';
import { Knex } from 'knex';
import { Options, History, OptionList, Code, OptionInList, Vote } from './model';

export function Service(knex: Knex) {
  return Object.freeze({
    getOptions: async () => {
      return await knex<Options>('options').select('id', 'name');
    },

    getHistoryByCode: async (code: string) => {
      return await knex<History>('history')
        .join<Code>('code', 'history.code_id', 'code.id')
        .join<Options>('options', 'history.option_id', 'options.id')
        .select(
          knex.ref('id').withSchema('history'),
          knex.ref('date').withSchema('history'),
          knex.ref('name').withSchema('options')
        )
        .where('code.code', code)
        .orderBy('date', 'desc');
    },

    getOptionListByCode: async (code: string) => {
      return await knex<OptionList[]>('option_list')
        .join<Code>('code', 'code.option_list_id', 'option_list.id')
        .select(knex.ref('id').withSchema('option_list'), knex.ref('name').withSchema('option_list'))
        .where('code', code)
        .first();
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
          knex.raw("CONCAT('[',GROUP_CONCAT( JSON_OBJECT('id', ?, 'optionId', ?, 'optionName', ?)),']') AS 'details'", [
            knex.ref('id').withSchema('option_in_list'),
            knex.ref('id').withSchema('options'),
            knex.ref('name').withSchema('options'),
          ]) as any as Knex.Ref<'details', { details: 'details' }>
        )
        .groupBy('id')
        .first();
      if (!res) {
        return null;
      }
      return { ...res, details: JSON.parse(res.details) };
    },

    getTodayOptionsByCode: async (code: string) => {
      return await knex<Code>('code')
        .where('code', code)
        .join<History>('today_options', 'today_options.code_id', 'code.id')
        .join<Options>('options', 'options.id', 'today_options.option_id')
        .select('today_options.id', 'today_options.date', 'options.id', 'options.name')
        .whereRaw('today_options.date = CURDATE()');
    },

    getTodayVoteByCode: async (code: string, user: string) => {
      return await knex<Code>('code')
        .where('code', code)
        .join<Vote>('vote', 'vote.code_id', 'code.id')
        .join<Options>('options', 'options.id', 'vote.option_id')
        .select(
          knex.ref('id').withSchema('vote'),
          knex.ref('date').withSchema('vote'),
          knex.ref('user').withSchema('vote'),
          knex.ref('id').withSchema('options').as('optionId'),
          knex.ref('name').withSchema('options')
        )
        .whereRaw('vote.date = CURDATE()')
        .where('vote.user', user);
    },

    postTodayVote: async (code: string, user: string, optionId: number) => {
      // TODO: check option in today option list

      const codeId = (await knex<Code>('code').select('id').where('code', code).first())?.id;
      if (!codeId) {
        return { code: 403, message: 'Invalid code' };
      }

      const duplicated = (
        await knex<Vote>('vote')
          .count('*', { as: 'count' })
          .where({ user, code_id: codeId, date: format(new Date(), 'yyyy-MM-dd') })
          .first()
      )?.count;
      if (duplicated) {
        return { code: 403, message: 'You have voted today already' };
      }

      const validateOptionId = (
        await knex<Options>('options').count('*', { as: 'count' }).where('id', optionId).first()
      )?.count;
      if (!validateOptionId) {
        return { code: 403, message: 'Please check your option.' };
      }

      return await knex<Vote>('vote').insert({
        date: format(new Date(), 'yyyy-MM-dd'),
        user,
        option_id: optionId,
        code_id: codeId,
      });
    },

    getTodayResultByCode: async (code: string) => {
      return await knex<History>('history')
        .join<Code>('code', 'history.code_id', 'code.id')
        .join<Options>('options', 'history.option_id', 'options.id')
        .select(
          knex.ref('id').withSchema('history'),
          knex.ref('date').withSchema('history'),
          knex.ref('name').withSchema('options')
        )
        .where('code.code', code)
        .whereRaw('history.date = CURDATE()')
        .first();
    },
  });
}
