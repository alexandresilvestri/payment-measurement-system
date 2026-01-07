import { describe, it, expect, beforeEach } from 'vitest'
import { contractService } from '../instances'
import type { CreateContractParams } from '../Contract'
import {
  createTestContract,
  cleanDatabase,
} from '../../test-helpers/db-helpers'
import { supplierService, workService } from '../instances'
import { create } from 'domain'

describe('Contract - integration crud test', () => {
  let testData: Awaited<ReturnType<typeof createTestContract>>

  beforeEach(async () => {
    await cleanDatabase()
    testData = await createTestContract()
  })

  describe('when creating a new supplier', () => {
    it('create a new contract', async () => {
      const startDate = new Date('2024-01-01')
      const deliveryDate = new Date('2024-12-31')

      const createContractParams: CreateContractParams = {
        workId: testData.work.id,
        supplierId: testData.supplier.id,
        service: 'Colocação de tijolos refratários em churrasqueiras',
        totalValue: 100000.0,
        startDate,
        deliveryDate,
      }

      const createdContract =
        await contractService.createContract(createContractParams)

      expect(createdContract).toEqual({
        id: expect.any(String),
        work: await workService.getWorkById(createContractParams.workId),
        supplier: await supplierService.getSupplierById(createContractParams.supplierId),
        service: 'Colocação de tijolos refratários em churrasqueiras',
        totalValue: 100000.0,
        startDate: expect.any(Date),
        deliveryTime: expect.any(Date),
      })
    })
  })
})
