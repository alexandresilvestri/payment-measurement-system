// import { Contract } from '../contracts.js'
import { Work } from '../works'
import { Supplier } from '../supplier'

export type CreateContractRequest = {
    service: string
    totalValue: number
    startDate: Date
    deliveryDate?: Date
}

export type ContractResponse = {
    id: string
    work: Work | null
    supplier: Supplier | null
    service: string
    totalValue: number
    startDate: Date
    deliveryTime: Date | null
}