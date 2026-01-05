import type { Knex } from 'knex'
import * as argon2 from 'argon2'
import { randomUUID } from 'crypto'

export async function seed(knex: Knex): Promise<void> {
  const adminUserType = await knex('user_types')
    .where({ name: 'Administrator' })
    .first()

  if (!adminUserType) {
    throw new Error(
      'Administrator user type not found. Please run user_types seed first.'
    )
  }

  const existingAdmin = await knex('users')
    .where({ email: 'admin@conferir.com' })
    .first()

  if (!existingAdmin) {
    const hashedPassword = await argon2.hash('Admin@2025')

    await knex('users').insert({
      id: randomUUID(),
      first_name: 'Admin',
      last_name: 'System',
      email: 'admin@conferir.com',
      password: hashedPassword,
      type_user_id: adminUserType.id,
    })
    console.log('✓ Admin user created (admin@conferir.com)')
  } else {
    console.log('✓ Admin user already exists (skipping)')
  }
}
