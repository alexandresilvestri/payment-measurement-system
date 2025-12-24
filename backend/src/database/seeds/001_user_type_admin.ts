import type { Knex } from 'knex'
import { randomUUID } from 'crypto'

export async function seed(knex: Knex): Promise<void> {
  await knex('user_types').insert({
    id: randomUUID(),
    name: 'Administrator',
    approve_measurement: true,
  })
}
