import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('options'))) {
    await knex.schema.createTable('options', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable('option_list'))) {
    await knex.schema.createTable('option_list', (table) => {
      table.increments();
      table.string('name').notNullable();
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable('option_in_list'))) {
    await knex.schema.createTable('option_in_list', (table) => {
      table.increments();
      table.integer('option_list_id').unsigned().notNullable();
      table.foreign('option_list_id').references('option_list.id');
      table.integer('option_id').unsigned().notNullable();
      table.foreign('option_id').references('options.id');
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable('code'))) {
    await knex.schema.createTable('code', (table) => {
      table.collate('utf8mb4_0900_as_cs');
      table.increments();
      table.string('code').notNullable();
      table.integer('option_list_id').unsigned().notNullable();
      table.foreign('option_list_id').references('option_list.id');
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable('history'))) {
    await knex.schema.createTable('history', (table) => {
      table.increments();
      table.date('date').notNullable();
      table.integer('option_id').unsigned().notNullable();
      table.foreign('option_id').references('options.id');
      table.integer('code_id').unsigned().notNullable();
      table.foreign('code_id').references('code.id');
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable('today_options'))) {
    await knex.schema.createTable('today_options', (table) => {
      table.increments();
      table.date('date').notNullable();
      table.integer('code_id').unsigned().notNullable();
      table.foreign('code_id').references('code.id');
      table.integer('option_id').unsigned().notNullable();
      table.foreign('option_id').references('options.id');
      table.timestamps(false, true);
    });
  }

  if (!(await knex.schema.hasTable('vote'))) {
    await knex.schema.createTable('vote', (table) => {
      table.increments();
      table.date('date').notNullable();
      table.string('user').notNullable();
      table.integer('option_id').unsigned().notNullable();
      table.foreign('option_id').references('options.id');
      table.integer('code_id').unsigned().notNullable();
      table.foreign('code_id').references('code.id');
      table.timestamps(false, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('vote');
  await knex.schema.dropTableIfExists('today_options');
  await knex.schema.dropTableIfExists('history');
  await knex.schema.dropTableIfExists('code');
  await knex.schema.dropTableIfExists('option_in_list');
  await knex.schema.dropTableIfExists('option_list');
  await knex.schema.dropTableIfExists('options');
}
