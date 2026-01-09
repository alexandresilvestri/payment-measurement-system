import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('contract_items', (table) => {
    table.renameColumn('contract', 'contract_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('contract_items', (table) => {
    table.renameColumn('contract_id', 'contract')
  })
}
