import { Contract } from '../types/contracts.js'
import { ContractItem } from '../types/contractItems.js'
import { IContractRepository } from '../repository/contracts.js'
import { IWorkRepository } from '../repository/works.js'
import { ISupplierRepository } from '../repository/suppliers.js'
import { randomUUID } from 'crypto'
import { ContractResponse } from '../types/api/contracts.js'

export type CreateContractParams = {
  workId: string
  supplierId: string
  service: string
  startDate: string
  deliveryDate?: string
  items: Omit<
    ContractItem,
    'id' | 'contract' | 'createdAt' | 'updatedAt' | 'totalItemValue'
  >[]
}

export class ContractService {
  constructor(
    private contractRepo: IContractRepository,
    private workRepo: IWorkRepository,
    private supplierRepo: ISupplierRepository
  ) {}

  async createContractWithItems(
    params: CreateContractParams
  ): Promise<ContractResponse> {
    const contractId = randomUUID()

    const contractItems: ContractItem[] = params.items.map((item) => ({
      id: randomUUID(),
      contract: contractId,
      unitMeasure: item.unitMeasure,
      quantity: item.quantity,
      unitLaborValue: item.unitLaborValue,
      totalItemValue: item.quantity * item.unitLaborValue,
      description: item.description,
    }))

    const totalValue = contractItems.reduce(
      (sum, item) => sum + item.totalItemValue,
      0
    )

    const { contract: createdContract } =
      await this.contractRepo.createContractWithItems({
        id: contractId,
        work: params.workId,
        supplier: params.supplierId,
        service: params.service.trim(),
        totalValue: totalValue,
        start_date: params.startDate,
        delivery_time: params.deliveryDate,
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
    }

    return contractResponse
  }

  async getContracts(): Promise<Contract[] | null> {
    const contracts = await this.contractRepo.findAll()

    if (!contracts) return []

    return contracts
  }

  async getContract(id: string): Promise<Contract | null> {
    const contract = await this.contractRepo.findById(id)
    return contract
  }
}
