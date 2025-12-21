import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user_types', (table) => {
    table.boolean('approve_measurement').defaultTo(false)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('user_types', (table) => {
    table.dropColumn('approve_measurement')
  })
}
