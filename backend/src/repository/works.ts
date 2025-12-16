import type { Work } from '../types/works'
import type { WorkDatabaseRow } from '../types/database'
import { BaseRepository } from './BaseRepository'
import { NotFoundError } from '../errors'

export interface IWorkRepository {
  create(work: Work): Promise<void>
  update(id: string, updates: Partial<Omit<Work, 'id'>>): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Work | null>
}

class WorkRepository
  extends BaseRepository<Work, WorkDatabaseRow>
  implements IWorkRepository
{
  constructor() {
    super('works')
  }

  async update(id: string, updates: Partial<Omit<Work, 'id'>>): Promise<void> {
    const result = await this.db('works').where({ id }).update(updates)

    if (result === 0) {
      throw new NotFoundError('Work not found')
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.db('works').where({ id }).del()

    if (result === 0) {
      throw new NotFoundError('Work not found')
    }
  }

  protected toDomain(row: WorkDatabaseRow): Work {
    return {
      id: row.id,
      name: row.name,
      code: row.code,
      address: row.address,
      contractor: row.contractor,
      status: row.status,
    }
  }

  protected toDatabase(work: Work): WorkDatabaseRow {
    return {
      id: work.id,
      name: work.name,
      code: work.code,
      address: work.address,
      contractor: work.contractor,
      status: work.status,
    }
  }
}

export const workRepository = new WorkRepository()
