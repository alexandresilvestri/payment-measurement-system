import type { Knex } from 'knex'
import { randomUUID } from 'crypto'

export async function seed(knex: Knex): Promise<void> {
  const existingUserType = await knex('user_types')
    .where({ name: 'Administrator' })
    .first()

  if (!existingUserType) {
    await knex('user_types').insert({
      id: randomUUID(),
      name: 'Administrator',
      approve_measurement: true,
    })
    console.log('✓ Administrator user type created')
  } else {
    console.log('✓ Administrator user type already exists (skipping)')
  }
}
