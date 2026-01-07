import { Contract } from '../types/contracts.js'
import { IContractRepository } from '../repository/contracts.js'
import { NotFoundError } from '../errors/index.js'
import { IWorkRepository } from '../repository/works.js'
import { ISupplierRepository } from '../repository/suppliers.js'
import { randomUUID } from 'crypto'
import { ContractResponse } from '../types/api/contracts.js'

export type CreateContractParams = {
  workId: string
  supplierId: string
  service: string
  totalValue: number
  startDate: Date
  deliveryDate?: Date
}

export class ContractService {
  constructor(
    private contractRepo: IContractRepository,
    private workRepo: IWorkRepository,
    private supplierRepo: ISupplierRepository
  ) {}

  async createContract(
    params: CreateContractParams
  ): Promise<ContractResponse> {
    const createContractIntent: Contract = {
      id: randomUUID(),
      workId: params.workId,
      supplierId: params.supplierId,
      service: params.service.trim(),
      totalValue: params.totalValue,
      startDate: params.startDate,
      deliveryTime: params.deliveryDate ?? null,
    }

    await this.contractRepo.create(createContractIntent)
    const createdContract = await this.contractRepo.findById(
      createContractIntent.id
    )

    if (!createdContract) throw new NotFoundError('Failoed to create contract')

    const workId = createContractIntent.workId
    const supplierId = createContractIntent.supplierId

    const contractResponse: ContractResponse = {
      id: createContractIntent.id,
      work: await this.workRepo.findById(workId),
      supplier: await this.supplierRepo.findById(supplierId),
      service: createContractIntent.service,
      totalValue: createContractIntent.totalValue,
      startDate: createContractIntent.startDate,
      deliveryTime: createContractIntent.deliveryTime || null,
    }

    return contractResponse
  }
}
