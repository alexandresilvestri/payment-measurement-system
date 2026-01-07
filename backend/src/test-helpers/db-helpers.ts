import { db } from '../database/db.js'
import type { Work } from '../types/works.js'
import type {
  UserDatabaseRow,
  SupplierDatabaseRow,
  ContractDatabaseRow,
} from '../types/database.js'

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

export async function createTestContract(): Promise<{
  work: Work
  supplier: SupplierDatabaseRow
  contract: ContractDatabaseRow
}> {
  const workId = crypto.randomUUID()
  const work: Work = {
    id: workId,
    name: 'Condomínio Residencial Jardim das Flores',
    code: 1,
    address: 'Rua das Acácias, 123 - Bairro Jardim - São Paulo/SP',
    contractor: 'Construtora Alpha LTDA',
    status: 'ATIVA',
  }
  await db('works').insert(work)

  const supplierId = crypto.randomUUID()
  const supplier: SupplierDatabaseRow = {
    id: supplierId,
    type_person: 'FISICA',
    name: 'Pedro Almeida',
    document: '123.456.789-00',
    pix: '12345678900',
    created_at: new Date(),
    updated_at: new Date(),
  }
  await db('suppliers').insert(supplier)

  const contractId = crypto.randomUUID()
  const contract: ContractDatabaseRow = {
    id: contractId,
    work: workId,
    supplier: supplierId,
    service: 'Test Service',
    total_value: 10000,
    start_date: new Date(),
    delivery_time: null,
  }
  await db('contracts').insert(contract)

  return { work, supplier, contract }
}

export async function cleanDatabase(): Promise<void> {
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
