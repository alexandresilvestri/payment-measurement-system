import { db } from '../database/db.js'
import type { Work } from '../types/works.js'
import type { UserDatabaseRow, SupplierDatabaseRow } from '../types/database.js'

export async function createTestWork(overrides?: Partial<Work>): Promise<Work> {
  const defaultWork: Work = {
    id: crypto.randomUUID(),
    name: 'Test Work',
    code: 123,
    address: 'Test Address, 123',
    contractor: 'Test Contractor',
    status: 'ATIVA',
    ...overrides,
  }

  await db('works').insert(defaultWork)
  return defaultWork
}

export async function createTestWorks(count: number): Promise<Work[]> {
  const works: Work[] = []

  for (let i = 1; i <= count; i++) {
    const work = await createTestWork({
      name: `Test Work ${i}`,
      code: 100 + i,
      address: `Test Address ${i}`,
    })
    works.push(work)
  }

  return works
}

export async function createTestUser(
  overrides?: Partial<UserDatabaseRow>
): Promise<UserDatabaseRow> {
  const userTypeExists = await db('user_types').where({ id: 1 }).first()
  if (!userTypeExists) {
    await db('user_types').insert({
      id: 1,
      name: 'Admin',
      created_at: new Date(),
      updated_at: new Date(),
    })
  }

  const defaultUser: UserDatabaseRow = {
    id: crypto.randomUUID(),
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
    password: 'hashed_password',
    type_user_id: '1',
    ...overrides,
  }

  await db('users').insert(defaultUser)
  return defaultUser
}

export async function createTestSupplier(
  overrides?: Partial<SupplierDatabaseRow>
): Promise<SupplierDatabaseRow> {
  const defaultSupplier: SupplierDatabaseRow = {
    id: crypto.randomUUID(),
    type_person: 'FISICA',
    name: 'Test Supplier',
    document: '123.456.789-00',
    pix: '12345678900',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides,
  }

  await db('suppliers').insert(defaultSupplier)
  return defaultSupplier
}

export async function cleanDatabase(): Promise<void> {
  await db('contract_items').del()
  await db('contracts').del()
  await db('users').del()
  await db('suppliers').del()
  await db('works').del()
  await db('user_types').del()
}

export async function getAllWorks(): Promise<Work[]> {
  return db('works').select('*')
}

export async function getWorkById(id: string): Promise<Work | null> {
  return db('works').where({ id }).first()
}
