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
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })

  describe('when trying create new supplier, but the supplier name, document or pix already used', async () => {
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

  describe('when get supplier register', () => {
    it('get supplier register', async () => {
      const createSupplierParams: CreateSupplierParams = {
        name: 'Fornecedor',
        typePerson: 'FISICA',
        document: '12312312312',
        pix: '51999999999',
      }

      const supplier =
        await supplierService.createSupplier(createSupplierParams)
      const id = supplier.id
      const supplierRow = await supplierService.getSupplierById(id)
      expect(supplierRow).toEqual({
        id: id,
        name: 'Fornecedor',
        typePerson: 'FISICA',
        document: '12312312312',
        pix: '51999999999',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })

  describe('when get all supplier', async () => {
    it('get all suppliers', async () => {
      const createFirstSupplierParams: CreateSupplierParams = {
        name: 'Fornecedor 01',
        typePerson: 'FISICA',
        document: '12312312312',
        pix: '47999999999',
      }

      const createSecondSupplierParams: CreateSupplierParams = {
        name: 'Fornecedor 02',
        typePerson: 'JURIDICA',
        document: '12312312313',
        pix: '51999999999',
      }

      await supplierService.createSupplier(createFirstSupplierParams)
      await supplierService.createSupplier(createSecondSupplierParams)

      const suppliers = await supplierService.getAllSuppliers()
      expect(suppliers).toEqual([
        {
          id: expect.any(String),
          name: 'Fornecedor 01',
          typePerson: 'FISICA',
          document: '12312312312',
          pix: '47999999999',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
        {
          id: expect.any(String),
          name: 'Fornecedor 02',
          typePerson: 'JURIDICA',
          document: '12312312313',
          pix: '51999999999',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ])
    })
  })

  describe('when try get all suppliers, but dont have any register', () => {
    it('return empty array', async () => {
      const emptySuppliersResponse = await supplierService.getAllSuppliers()
      expect(emptySuppliersResponse).toEqual([])
    })
  })

  describe('when updating a supplier', () => {
    it('updates supplier name', async () => {
      const createSupplierParams: CreateSupplierParams = {
        name: 'Original Name',
        typePerson: 'FISICA',
        document: '12345678901',
        pix: '47999999999',
      }

      const createdSupplier =
        await supplierService.createSupplier(createSupplierParams)

      const updatedSupplier = await supplierService.updateSupplier(
        createdSupplier.id,
        {
          name: 'Updated Name',
        }
      )

      expect(updatedSupplier).toEqual({
        id: createdSupplier.id,
        name: 'Updated Name',
        typePerson: 'FISICA',
        document: '12345678901',
        pix: '47999999999',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('updates supplier document and typePerson', async () => {
      const createSupplierParams: CreateSupplierParams = {
        name: 'Test Supplier',
        typePerson: 'FISICA',
        document: '98765432109',
        pix: '51999888777',
      }

      const createdSupplier =
        await supplierService.createSupplier(createSupplierParams)

      const updatedSupplier = await supplierService.updateSupplier(
        createdSupplier.id,
        {
          typePerson: 'JURIDICA',
          document: '12345678901234',
        }
      )

      expect(updatedSupplier).toEqual({
        id: createdSupplier.id,
        name: 'Test Supplier',
        typePerson: 'JURIDICA',
        document: '12345678901234',
        pix: '51999888777',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('throws error when supplier not found', async () => {
      await expect(
        supplierService.updateSupplier('00000000-0000-0000-0000-000000000000', {
          name: 'Test',
        })
      ).rejects.toThrow('suppliers not found')
    })
  })

  describe('when deleting a supplier', () => {
    it('deletes an existing supplier', async () => {
      const createSupplierParams: CreateSupplierParams = {
        name: 'Supplier to Delete',
        typePerson: 'FISICA',
        document: '11111111111',
        pix: '47988887777',
      }

      const createdSupplier =
        await supplierService.createSupplier(createSupplierParams)

      await supplierService.deleteSupplier(createdSupplier.id)

      const deletedSupplier = await supplierService.getSupplierById(
        createdSupplier.id
      )

      expect(deletedSupplier).toBeNull()
    })

    it('throws error when trying to delete non-existent supplier', async () => {
      await expect(
        supplierService.deleteSupplier('00000000-0000-0000-0000-000000000000')
      ).rejects.toThrow('suppliers not found')
    })
  })
})
