import type { Knex } from 'knex'
import { randomUUID } from 'crypto'

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del()

  await knex('user_types').del()

  await knex('user_types').insert([
    {
      id: randomUUID(),
      name: 'Engenheiro',
      approve_measurement: true,
    },
    {
      id: randomUUID(),
      name: 'Advogado',
      approve_measurement: false,
    },
    {
      id: randomUUID(),
      name: 'Visitante',
      approve_measurement: false,
    },
  ])
}
