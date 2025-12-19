import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('suppliers', (table) => {
    table.string('name').notNullable().unique()
    table.unique('document')
    table.unique('pix')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('suppliers', (table) => {
    table.dropUnique(['document'])
    table.dropUnique(['pix'])
    table.dropColumn('name')
  })
}
