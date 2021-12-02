import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('option_list', (table) => {
    table.integer('owner_id').unsigned();
    table.foreign('owner_id').references('user.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('option_list', (table) => {
    table.dropForeign('owner_id');
    table.dropColumn('owner_id');
  });
}
