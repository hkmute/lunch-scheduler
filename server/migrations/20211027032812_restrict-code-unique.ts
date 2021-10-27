import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('code', (table) => {
    table.unique(['code']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('code', (table) => {
    table.dropUnique(['code']);
  });
}
