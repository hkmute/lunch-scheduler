import { format } from 'date-fns';
import { Knex } from 'knex';
import { Code, OptionInList, OptionList, Vote } from './model';

export function InternalService(knex: Knex) {
  return Object.freeze({
    getCodeIdList: async () => {
      return await knex<Code>('code').select('id');
    },

    getCodeIdWithOptionIds: async () => {
      return await knex<Code>('code')
        .join<OptionList>('option_list', 'option_list.id', 'code.option_list_id')
        .join<OptionInList>('option_in_list', 'option_in_list.option_list_id', 'option_list.id')
        .select(
          knex.ref('id').withSchema('code').as('codeId'),
          knex.raw('CONCAT("[", GROUP_CONCAT(?), "]") as "optionIds"', [
            knex.ref('option_id').withSchema('option_in_list'),
          ]) as any as Knex.Ref<'optionIds', { optionIds: 'optionIds' }>
        )
        .groupBy('codeId');
    },

    insertTodayOptions: async (results: { optionId: number; codeId: number }[]) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      return await knex<History>('today_options').insert(
        results.map((result) => ({ date: today, option_id: result.optionId, code_id: result.codeId }))
      );
    },

    getTodayVotes: async () => {
      return await knex<Vote>('vote')
        .join<Code>('code', 'code.id', 'vote.code_id')
        .select(knex.ref('option_id').withSchema('vote').as('optionId'), knex.ref('id').withSchema('code').as('codeId'))
        .count({ count: knex.ref('option_id').withSchema('vote') })
        .whereRaw('vote.date = CURDATE()')
        .groupBy('optionId')
        .groupBy('codeId');
    },

    insertTodaySystemVote: async (results: { optionId: number; codeId: number }[]) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      return await knex<Vote>('vote').insert(
        results.map((result) => ({ date: today, option_id: result.optionId, code_id: result.codeId, user: 'system' }))
      );
    },

    insertResults: async (results: { optionId: number; codeId: number }[]) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      return await knex<History>('history').insert(
        results.map((result) => ({ date: today, option_id: result.optionId, code_id: result.codeId }))
      );
    },
  });
}
