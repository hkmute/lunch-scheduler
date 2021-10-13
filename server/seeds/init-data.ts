import { add } from 'date-fns';
import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  try {
    // Deletes ALL existing entries
    await knex('vote').del();
    await knex('today_options').del();
    await knex('history').del();
    await knex('code').del();
    await knex('option_in_list').del();
    await knex('option_list').del();
    await knex('options').del();

    // Inserts seed entries
    const options = [
      { name: '紅米' },
      { name: '上勝日本料理' },
      { name: '圍威喂' },
      { name: '瑞士咖啡室' },
      { name: '開花結果' },
      { name: '樂天冰室' },
      { name: '譚仔雲南米線' },
    ];
    await knex('options').insert(options);
    const optionsId = await knex('options').select('id');

    await knex('option_list').insert([{ name: 'example list' }, { name: 'example list2' }]);
    const listId = await knex('option_list').select('id').first();

    await knex('option_in_list').insert(
      optionsId.map((optionId) => ({
        option_list_id: listId.id,
        option_id: optionId.id,
      }))
    );

    await knex('code').insert([
      { code: 'example', option_list_id: listId.id },
      { code: 'example2', option_list_id: listId.id },
    ]);
    const codeId = await knex('code').select().first();

    const today = new Date();
    await knex('history').insert(
      [...new Array(50)].map((ele, index) => ({
        date: add(today, { days: index }),
        option_id: optionsId[Math.floor(optionsId.length * Math.random())].id,
        code_id: codeId.id,
      }))
    );
  } catch (err) {
    console.log(err);
  }
}
