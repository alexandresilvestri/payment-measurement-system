import type { Knex } from 'knex'
import * as argon2 from 'argon2'
import { randomUUID } from 'crypto'

export async function seed(knex: Knex): Promise<void> {
  const engineerType = await knex('user_types')
    .where({ name: 'Engenheiro' })
    .first()
  const lawyerType = await knex('user_types')
    .where({ name: 'Advogado' })
    .first()
  const visitantType = await knex('user_types')
    .where({ name: 'Visitante' })
    .first()

  if (!engineerType || !lawyerType || !visitantType) {
    throw new Error('User types not found. Please run user_types seed first.')
  }

  const hashedPassword = await argon2.hash('Password123!')

  await knex('users').insert([
    {
      id: randomUUID(),
      first_name: 'Maurício',
      last_name: 'de Carvalho',
      email: 'mauriciovcarvalho@hotmail.com',
      password: hashedPassword,
      type_user_id: engineerType.id,
    },
    {
      id: randomUUID(),
      first_name: 'Juan',
      last_name: 'Langer',
      email: 'juan.langer@gmail.com',
      password: hashedPassword,
      type_user_id: lawyerType.id,
    },
    {
      id: randomUUID(),
      first_name: 'Kariane',
      last_name: 'Winter',
      email: 'administrativo@conferirengenharia.com',
      password: hashedPassword,
      type_user_id: visitantType.id,
    },
    {
      id: randomUUID(),
      first_name: 'Alexandre',
      last_name: 'Silvestri',
      email: 'alexandretunni03@gmail.com',
      password: hashedPassword,
      type_user_id: visitantType.id,
    },
  ])
}
