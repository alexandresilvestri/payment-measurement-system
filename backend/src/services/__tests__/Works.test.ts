import { describe, it, expect } from 'vitest'
import { workService } from '../instances'
import type { CreateWorkRequest } from '../../types/works'
import { db } from '../../database/db'

describe('Works - integration crud tests', () => {
  describe('when creating a new work', () => {
    it('creates a work in the database with all fields', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Residencial Alpha',
        code: 'CP-001',
        address: 'Rua General Lima e Silva, Centro, Rio Grande do Sul',
        contractor: 'Roberto Macedo',
        status: 'ATIVA',
      }

      const createdWork = await workService.createWork(createWorkParams)

      expect(createdWork).toEqual({
        id: expect.any(String),
        name: 'Residencial Alpha',
        code: 'CP-001',
        address: 'Rua General Lima e Silva, Centro, Rio Grande do Sul',
        contractor: 'Roberto Macedo',
        status: 'ATIVA',
      })

      const workInDb = await db('works').where({ id: createdWork.id }).first()
      expect(workInDb).toBeDefined()
      expect(workInDb.name).toBe('Residencial Alpha')
      expect(workInDb.code).toBe('CP-001')
      expect(workInDb.address).toBe(
        'Rua General Lima e Silva, Centro, Rio Grande do Sul'
      )
      expect(workInDb.contractor).toBe('Roberto Macedo')
      expect(workInDb.status).toBe('ATIVA')
    })

    it('creates a work with only required fields', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Obra IFSC',
        address: '1400, Canoas',
      }

      const createdWork = await workService.createWork(createWorkParams)

      expect(createdWork).toEqual({
        id: expect.any(String),
        name: 'Obra IFSC',
        code: null,
        address: '1400, Canoas',
        contractor: null,
        status: 'ATIVA',
      })
    })

    describe('when updating a work', () => {
      it('updates the work successfully', async () => {
        const createWorkParams: CreateWorkRequest = {
          name: 'Obra 1',
          address: 'Endereço 1',
        }

        const createdWork = await workService.createWork(createWorkParams)

        const updatedWork = await workService.updateWork(createdWork.id, {
          name: 'Obra 2',
          address: 'Endereço 2',
          contractor: 'Governo',
        })

        expect(updatedWork).toEqual({
          id: createdWork.id,
          name: 'Obra 2',
          code: null,
          address: 'Endereço 2',
          contractor: 'Governo',
          status: 'ATIVA',
        })
      })

      it('throws an error if work does not exist', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000'

        await expect(
          workService.updateWork(nonExistentId, {
            name: 'Obra 2',
          })
        ).rejects.toThrow('works not found')
      })
    })

    describe('when deleting a work', () => {
      it('deletes the work successfully', async () => {
        const createWorkParams: CreateWorkRequest = {
          name: 'Obra errada',
          address: 'Rua torta',
        }

        const createdWork = await workService.createWork(createWorkParams)

        await workService.deleteWork(createdWork.id)

        const workInDb = await db('works').where({ id: createdWork.id }).first()
        expect(workInDb).toBeUndefined()
      })

      it('throws an error if deletion fails', async () => {
        const nonExistentId = '00000000-0000-0000-0000-000000000000'

        await expect(workService.deleteWork(nonExistentId)).rejects.toThrow()
      })
    })
  })
})
