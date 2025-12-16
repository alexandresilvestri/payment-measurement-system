import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { db } from '../database/db'

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must run with NODE_ENV=test')
  }

  try {
    await db.migrate.latest()
    console.log('Test database migrations completed')
  } catch (error) {
    console.error('Failed to run migrations:', error)
    throw error
  }
})

beforeEach(async () => {})

afterEach(async () => {
  const tables = ['works', 'users', 'user_types']

  for (const table of tables) {
    try {
      await db(table).del()
    } catch (error) {
      if (error instanceof Error && !error.message.includes('does not exist')) {
        console.error(`Failed to clean table ${table}:`, error)
        throw error
      }
    }
  }
})

afterAll(async () => {
  await db.destroy()
  console.log('Test database connection closed')
})
