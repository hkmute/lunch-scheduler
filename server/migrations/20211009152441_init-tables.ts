import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('options', (table) => {
    table.increments();
    table.string('name');
    table.timestamps(false, true);
  });

  await knex.schema.createTable('option_list', (table) => {
    table.increments();
    table.string('name');
    table.timestamps(false, true);
  });

  await knex.schema.createTable('option_in_list', (table) => {
    table.increments();
    table.integer('option_list_id').unsigned();
    table.foreign('option_list_id').references('option_list.id');
    table.integer('option_id').unsigned();
    table.foreign('option_id').references('options.id');
    table.timestamps(false, true);
  });

  await knex.schema.createTable('code', (table) => {
    table.increments();
    table.string('code');
    table.integer('option_list_id').unsigned();
    table.foreign('option_list_id').references('option_list.id');
    table.timestamps(false, true);
  });

  await knex.schema.createTable('history', (table) => {
    table.increments();
    table.date('date');
    table.integer('option_id').unsigned();
    table.foreign('option_id').references('options.id');
    table.integer('code_id').unsigned();
    table.foreign('code_id').references('code.id');
    table.timestamps(false, true);
  });

  await knex.schema.createTable('today_options', (table) => {
    table.increments();
    table.date('date');
    table.integer('code_id').unsigned();
    table.foreign('code_id').references('code.id');
    table.integer('option_id').unsigned();
    table.foreign('option_id').references('options.id');
    table.timestamps(false, true);
  });

  await knex.schema.createTable('vote', (table) => {
    table.increments();
    table.date('date');
    table.string('user');
    table.integer('option_id').unsigned();
    table.foreign('option_id').references('options.id');
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('vote');
  await knex.schema.dropTable('today_options');
  await knex.schema.dropTable('history');
  await knex.schema.dropTable('code');
  await knex.schema.dropTable('option_in_list');
  await knex.schema.dropTable('option_list');
  await knex.schema.dropTable('options');
}
