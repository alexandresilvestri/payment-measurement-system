import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('contracts', (table) => {
    table
      .enum('status', ['Ativo', 'Encerrado'])
      .notNullable()
      .defaultTo('Ativo')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('contracts', (table) => {
    table.dropColumn('status')
  })
}
