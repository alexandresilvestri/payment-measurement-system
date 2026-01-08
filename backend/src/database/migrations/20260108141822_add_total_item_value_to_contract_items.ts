import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract_items', (table) => {
    table.decimal('total_item_value', 10, 2).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contract_items', (table) => {
    table.dropColumn('total_item_value')
  })
}
