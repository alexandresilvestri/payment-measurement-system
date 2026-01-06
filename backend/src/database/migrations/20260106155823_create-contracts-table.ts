import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('contracts', (table) => {
    table.uuid('id', { primaryKey: true })
    table
      .uuid('work')
      .notNullable()
      .references('id')
      .inTable('works')
      .onDelete('RESTRICT')
    table
      .uuid('supplier')
      .notNullable()
      .references('id')
      .inTable('suppliers')
      .onDelete('RESTRICT')
    table.string('service').notNullable()
    table.decimal('total_value', 19, 4).notNullable()
    table.date('start_date').notNullable()
    table.date('delivery_time')
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('contracts')
}
