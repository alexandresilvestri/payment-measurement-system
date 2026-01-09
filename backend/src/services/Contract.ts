import { Contract } from '../types/contracts.js'
import { ContractItem, ContractListItem } from '../types/contractItems.js'
import { IContractRepository } from '../repository/contracts.js'
import { IWorkRepository } from '../repository/works.js'
import { ISupplierRepository } from '../repository/suppliers.js'
import { IContractItemRepository } from '../repository/contractItems.js'
import { randomUUID } from 'crypto'
import { ContractResponse } from '../types/api/contracts.js'

export type CreateContractParams = {
  workId: string
  supplierId: string
  service: string
  startDate: string
  deliveryTime?: string
  items: Omit<
    ContractItem,
    'id' | 'contractId' | 'createdAt' | 'updatedAt' | 'totalValue'
  >[]
}

export class ContractService {
  constructor(
    private contractRepo: IContractRepository,
    private workRepo: IWorkRepository,
    private supplierRepo: ISupplierRepository,
    private contractItemRepo: IContractItemRepository
  ) {}

  async createContractWithItems(
    params: CreateContractParams
  ): Promise<ContractResponse> {
    const contractId = randomUUID()

    const contractItems: ContractItem[] = params.items.map((item) => ({
      id: randomUUID(),
      contractId: contractId,
      unitMeasure: item.unitMeasure,
      quantity: item.quantity,
      unitLaborValue: item.unitLaborValue,
      totalValue: item.quantity * item.unitLaborValue,
      description: item.description,
    }))

    const totalValue = contractItems.reduce(
      (sum, item) => sum + item.totalValue,
      0
    )

    const { contract: createdContract, items } =
      await this.contractRepo.createContractWithItems({
        id: contractId,
        work_id: params.workId,
        supplier_id: params.supplierId,
        service: params.service.trim(),
        totalValue: totalValue,
        start_date: params.startDate,
        delivery_time: params.deliveryTime,
        status: 'Ativo',
        items: contractItems,
      })

    const workId = createdContract.workId
    const supplierId = createdContract.supplierId

    const contractResponse: ContractResponse = {
      id: createdContract.id,
      work: await this.workRepo.findById(workId),
      supplier: await this.supplierRepo.findById(supplierId),
      service: createdContract.service,
      totalValue: createdContract.totalValue,
      startDate: createdContract.startDate,
      deliveryTime: createdContract.deliveryTime || null,
      status: createdContract.status,
      items: items,
    }

    return contractResponse
  }

  async getContracts(filters?: {
    workId?: string
    supplierId?: string
  }): Promise<ContractListItem[]> {
    const contracts = await this.contractRepo.findAllWithFilters(filters)

    if (!contracts) return []

    return contracts
  }

  async getContractInfo(id: string): Promise<Contract | null> {
    const contract = await this.contractRepo.findById(id)
    return contract
  }

  async getContract(id: string): Promise<ContractResponse | null> {
    const contract = await this.contractRepo.findById(id)

    if (!contract) return null

    const work = await this.workRepo.findById(contract.workId)
    const supplier = await this.supplierRepo.findById(contract.supplierId)
    const items = await this.contractItemRepo.findByContractId(contract.id)

    const contractResponse: ContractResponse = {
      id: contract.id,
      work: work,
      supplier: supplier,
      service: contract.service,
      totalValue: contract.totalValue,
      startDate: contract.startDate,
      deliveryTime: contract.deliveryTime || null,
      status: contract.status,
      items: items,
    }

    return contractResponse
  }
}
