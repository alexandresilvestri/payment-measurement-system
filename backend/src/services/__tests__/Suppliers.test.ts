import { describe, it, expect } from 'vitest'
import { supplierService } from '../instances'
import type { CreateSupplierParams } from '../Supplier'

describe('Supplier - integration crud test', () => {
  describe('when creating a new supplier', () => {
    it('creates a supplier', async () => {
      const createSupplierParams: CreateSupplierParams = {
        name: 'Vanderlei Elétrica',
        typePerson: 'FISICA',
        document: '12312312312',
        pix: '47999999999',
      }

      const createdSupplier =
        await supplierService.createSupplier(createSupplierParams)

      expect(createdSupplier).toEqual({
        id: expect.any(String),
        name: 'Vanderlei Elétrica',
        typePerson: 'FISICA',
        document: '12312312312',
        pix: '47999999999',
      })
    })
  })

  describe('when the supplier name, document or pix already used', async () => {
    it('throws an error', async () => {
      const createSupplierParams: CreateSupplierParams = {
        name: 'Fornecedor',
        typePerson: 'FISICA',
        document: '12312312312',
        pix: '51999999999',
      }

      await supplierService.createSupplier(createSupplierParams)

      await expect(
        supplierService.createSupplier(createSupplierParams)
      ).rejects.toThrow(
        /name already exists|document already exists|pix already exists/
      )
    })
  })
})
