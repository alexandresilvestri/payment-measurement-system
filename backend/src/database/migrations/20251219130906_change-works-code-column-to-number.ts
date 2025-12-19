import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('works', (table) => {
    table.smallint('code').alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('works', (table) => {
    table.string('code').alter()
  })
}
