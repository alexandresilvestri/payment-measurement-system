import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('contracts', (table) => {
    table.renameColumn('work', 'work_id')
    table.renameColumn('supplier', 'supplier_id')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('contracts', (table) => {
    table.renameColumn('work_id', 'work')
    table.renameColumn('supplier_id', 'supplier')
  })
}
