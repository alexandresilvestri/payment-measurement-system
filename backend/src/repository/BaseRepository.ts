import { Knex } from 'knex'
import { db } from '../database/db.js'
import { NotFoundError } from '../errors/index.js'

export abstract class BaseRepository<TDomain, TDatabase = TDomain> {
  constructor(protected readonly tableName: string) {}

  protected get db(): Knex {
    return db
  }

  async findById(id: string): Promise<TDomain | null> {
    return this.findBy({ id })
  }

  async findBy(conditions: Record<string, unknown>): Promise<TDomain | null> {
    const row = (await this.db(this.tableName).where(conditions).first()) as
      | TDatabase
      | undefined

    if (!row) {
      return null
    }

    return this.toDomain(row)
  }

  async findAll(): Promise<TDomain[]> {
    const rows = (await this.db(this.tableName).select('*')) as TDatabase[]
    return rows.map((row) => this.toDomain(row))
  }

  async create(data: TDomain): Promise<void> {
    await this.db(this.tableName).insert(this.toDatabase(data))
  }

  async update(id: string, updates: Partial<TDatabase>): Promise<void> {
    const result = await this.db(this.tableName).where({ id }).update(updates)

    if (result === 0) {
      throw new NotFoundError(`${this.tableName} not found`)
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.db(this.tableName).where({ id }).del()

    if (result === 0) {
      throw new NotFoundError(`${this.tableName} not found`)
    }
  }

  protected toDomain(row: TDatabase): TDomain {
    return row as unknown as TDomain
  }

  protected toDatabase(data: TDomain): Partial<TDatabase> {
    return data as unknown as Partial<TDatabase>
  }
}
