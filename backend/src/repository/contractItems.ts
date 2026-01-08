import type { ContractItem } from '../types/contractItems.js'
import type { ContractItemDatabaseRow } from '../types/database.js'
import { BaseRepository } from './BaseRepository.js'

export interface IContractItemRepository {
  create(contractItem: ContractItem): Promise<void>
  createMany(contractItems: ContractItem[]): Promise<void>
  findById(id: string): Promise<ContractItem | null>
  findByContractId(contractId: string): Promise<ContractItem[]>
  findAll(): Promise<ContractItem[]>
}

class ContractItemRepository
  extends BaseRepository<ContractItem, ContractItemDatabaseRow>
  implements IContractItemRepository
{
  constructor() {
    super('contract_items')
  }

  async createMany(contractItems: ContractItem[]): Promise<void> {
    const databaseRows = contractItems.map((item) => this.toDatabase(item))
    await this.db(this.tableName).insert(databaseRows)
  }

  async findByContractId(contractId: string): Promise<ContractItem[]> {
    const rows = (await this.db(this.tableName)
      .where({ contract: contractId })
      .select('*')) as ContractItemDatabaseRow[]

    return rows.map((row) => this.toDomain(row))
  }

  protected toDomain(row: ContractItemDatabaseRow): ContractItem {
    return {
      id: row.id,
      contract: row.contract,
      unitMeasure: row.unit_measure,
      quantity: row.quantity,
      unitLaborValue: row.unit_labor_value,
      totalItemValue: row.total_item_value,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }

  protected toDatabase(data: ContractItem): ContractItemDatabaseRow {
    return {
      id: data.id,
      contract: data.contract,
      unit_measure: data.unitMeasure,
      quantity: data.quantity,
      unit_labor_value: data.unitLaborValue,
      total_item_value: data.totalItemValue,
      description: data.description,
      created_at: data.createdAt ?? new Date(),
      updated_at: data.updatedAt ?? new Date(),
    }
  }
}

export const contractItemRepository = new ContractItemRepository()
