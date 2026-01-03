import type { Work } from '../types/works.js'
import type { WorkDatabaseRow } from '../types/database.js'
import { BaseRepository } from './BaseRepository.js'

export interface IWorkRepository {
  create(work: Work): Promise<void>
  update(id: string, updates: Partial<Omit<Work, 'id'>>): Promise<void>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Work | null>
  findAll(): Promise<Work[]>
}

class WorkRepository
  extends BaseRepository<Work, WorkDatabaseRow>
  implements IWorkRepository
{
  constructor() {
    super('works')
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
