import { Knex } from 'knex'
import { db } from '../database/db'
import { NotFoundError } from '../errors'

/**
 * Base Repository class providing common CRUD operations
 * @template TDomain - The domain model type (camelCase properties)
 * @template TDatabase - The database row type (snake_case properties)
 */
export abstract class BaseRepository<TDomain, TDatabase = TDomain> {
  constructor(protected readonly tableName: string) {}

  protected get db(): Knex {
    return db
  }

  /**
   * Find a record by ID
   * @param id - The record ID
   * @returns The domain object or null if not found
   */
  async findById(id: string): Promise<TDomain | null> {
    const row = (await this.db(this.tableName).where({ id }).first()) as
      | TDatabase
      | undefined

    if (!row) {
      return null
    }

    return this.toDomain(row)
  }

  /**
   * Find all records
   * @returns Array of domain objects
   */
  async findAll(): Promise<TDomain[]> {
    const rows = (await this.db(this.tableName).select('*')) as TDatabase[]
    return rows.map((row) => this.toDomain(row))
  }

  /**
   * Create a new record
   * @param data - The domain object to insert
   */
  async create(data: TDomain): Promise<void> {
    await this.db(this.tableName).insert(this.toDatabase(data))
  }

  /**
   * Update a record by ID
   * @param id - The record ID
   * @param updates - Partial updates to apply
   * @throws NotFoundError if no record was updated
   */
  async update(id: string, updates: Partial<TDatabase>): Promise<void> {
    const result = await this.db(this.tableName).where({ id }).update(updates)

    if (result === 0) {
      throw new NotFoundError(`${this.tableName} not found`)
    }
  }

  /**
   * Delete a record by ID
   * @param id - The record ID
   * @throws NotFoundError if no record was deleted
   */
  async delete(id: string): Promise<void> {
    const result = await this.db(this.tableName).where({ id }).del()

    if (result === 0) {
      throw new NotFoundError(`${this.tableName} not found`)
    }
  }

  /**
   * Convert database row to domain object
   * Override this method if transformation is needed (e.g., snake_case to camelCase)
   * @param row - The database row
   * @returns The domain object
   */
  protected toDomain(row: TDatabase): TDomain {
    return row as unknown as TDomain
  }

  /**
   * Convert domain object to database row
   * Override this method if transformation is needed (e.g., camelCase to snake_case)
   * @param data - The domain object
   * @returns The database row
   */
  protected toDatabase(data: TDomain): TDatabase {
    return data as unknown as TDatabase
  }
}
