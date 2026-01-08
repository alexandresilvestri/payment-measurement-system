import type {
  Contract,
  CreateContractInputRepository,
} from '../types/contracts.js'
import type { ContractDatabaseRow } from '../types/database.js'
import type { ContractItem } from '../types/contractItems.js'
import { BaseRepository } from './BaseRepository.js'
import { contractItemRepository } from './contractItems.js'
import { ValidationError } from '../errors/ValidationError.js'

export interface IContractRepository {
  create(contract: Contract): Promise<void>
  createContractWithItems(
    data: CreateContractInputRepository
  ): Promise<{ contract: Contract; items: ContractItem[] }>
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

  async createContractWithItems(
    data: CreateContractInputRepository
  ): Promise<{ contract: Contract; items: ContractItem[] }> {
    const contract: Contract = {
      id: data.id,
      workId: data.work,
      supplierId: data.supplier,
      service: data.service,
      totalValue: data.totalValue,
      startDate: new Date(data.start_date),
      deliveryTime: data.delivery_time ? new Date(data.delivery_time) : null,
    }

    const contractItems: ContractItem[] = data.items

    if (contractItems.length === 0) {
      throw new ValidationError('Minimal one item per contract')
    }

    await this.db.transaction(async (trx) => {
      await trx(this.tableName).insert(this.toDatabase(contract))

      const itemsToInsert = contractItems.map((item) =>
        contractItemRepository['toDatabase'](item)
      )
      await trx('contract_items').insert(itemsToInsert)
    })

    return { contract, items: contractItems }
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
      created_at: data.createdAt ?? new Date(),
      updated_at: data.updatedAt ?? new Date(),
    }
  }
}

export const contractRepository = new ContractRepository()
