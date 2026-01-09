import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('contract_items', (table) => {
    table.renameColumn('total_item_value', 'total_value')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('contract_items', (table) => {
    table.renameColumn('total_value', 'total_item_value')
  })
}
