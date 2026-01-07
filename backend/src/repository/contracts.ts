import type { Contract } from '../types/contracts.js'
import type { ContractDatabaseRow } from '../types/database.js'
import { BaseRepository } from './BaseRepository.js'
// import { ConflictError } from '../errors/ConflictError.js'

export interface IContractRepository {
  create(contract: Contract): Promise<void>
  findById(id: string): Promise<Contract | null>
  findAll(): Promise<Contract[] | null>
}

class ContractRepository
  extends BaseRepository<Contract, ContractDatabaseRow>
  implements IContractRepository
{
  constructor() {
    super('contracts')
  }

  async create(contract: Contract): Promise<void> {
    await super.create(contract)
  }

  protected toDomain(row: ContractDatabaseRow): Contract {
    return {
      id: row.id,
      workId: row.work,
      supplierId: row.supplier,
      service: row.service,
      totalValue: row.total_value,
      startDate: row.start_date,
      deliveryTime: row.delivery_time,
    }
  }

  protected toDatabase(data: Contract): ContractDatabaseRow {
    return {
      id: data.id,
      work: data.workId,
      supplier: data.supplierId,
      service: data.service,
      total_value: data.totalValue,
      start_date: data.startDate,
      delivery_time: data.deliveryTime ?? null,
    }
  }
}

export const contractRepository = new ContractRepository()
