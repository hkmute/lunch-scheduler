import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('user'))) {
    await knex.schema.createTable('user', (table) => {
      table.increments();
      table.string('email').notNullable();
      table.string('name').notNullable();
      table.timestamps(false, true);
    });
  }

  await knex.schema.alterTable('code', (table) => {
    table.integer('owner_id').unsigned();
    table.foreign('owner_id').references('user.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('code', (table) => {
    table.dropForeign('owner_id');
    table.dropColumn('owner_id');
  });
  await knex.schema.dropTableIfExists('user');
}
