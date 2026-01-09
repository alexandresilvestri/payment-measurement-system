import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TABLE contracts
    DROP CONSTRAINT IF EXISTS contracts_work_foreign,
    DROP CONSTRAINT IF EXISTS contracts_supplier_foreign
  `)

  await knex.schema.alterTable('contracts', (table) => {
    table
      .foreign('work_id')
      .references('id')
      .inTable('works')
      .onDelete('RESTRICT')
    table
      .foreign('supplier_id')
      .references('id')
      .inTable('suppliers')
      .onDelete('RESTRICT')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contracts', (table) => {
    table.dropForeign(['work_id'])
    table.dropForeign(['supplier_id'])
  })

  await knex.raw(`
    ALTER TABLE contracts
    ADD CONSTRAINT contracts_work_foreign
      FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE RESTRICT,
    ADD CONSTRAINT contracts_supplier_foreign
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE RESTRICT
  `)
}
