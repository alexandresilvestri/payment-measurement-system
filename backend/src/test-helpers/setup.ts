import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { db } from '../database/db.js'
import { execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

beforeAll(async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Tests must run with NODE_ENV=test')
  }

  try {
    const knexfilePath = path.resolve(__dirname, '../database/knexfile.ts')
    execSync(
      `tsx node_modules/knex/bin/cli.js migrate:latest --knexfile ${knexfilePath}`,
      {
        cwd: path.resolve(__dirname, '../..'),
        env: { ...process.env, NODE_ENV: 'test' },
        stdio: 'inherit',
      }
    )
    console.log('Test database migrations completed')
  } catch (error) {
    console.error('Failed to run migrations:', error)
    throw error
  }
})

beforeEach(async () => {})

afterEach(async () => {
  const tables = [
    'contract_items',
    'contracts',
    'users',
    'suppliers',
    'works',
    'user_types',
  ]

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
