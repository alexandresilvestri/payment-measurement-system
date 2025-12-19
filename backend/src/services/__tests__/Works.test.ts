import { describe, it, expect } from 'vitest'
import { workService } from '../instances'
import type { CreateWorkRequest } from '../../types/api/works'
import { db } from '../../database/db'

describe('Works - integration crud tests', () => {
  describe('when creating a new work', () => {
    it('creates a work in the database with all fields', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Residencial Alpha',
        code: 101,
        address: 'Rua General Lima e Silva, Centro, Rio Grande do Sul',
        contractor: 'Roberto Macedo',
      }

      const createdWork = await workService.createWork(createWorkParams)

      expect(createdWork).toEqual({
        id: expect.any(String),
        name: 'Residencial Alpha',
        code: expect.any(Number),
        address: 'Rua General Lima e Silva, Centro, Rio Grande do Sul',
        contractor: 'Roberto Macedo',
        status: 'ATIVA',
      })
    })

    it('creates a work with only required fields', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Obra IFSC',
        code: 102,
        address: '1400, Canoas',
      }

      const createdWork = await workService.createWork(createWorkParams)

      expect(createdWork).toEqual({
        id: expect.any(String),
        name: 'Obra IFSC',
        code: expect.any(Number),
        address: '1400, Canoas',
        contractor: null,
        status: 'ATIVA',
      })
    })

    describe('when updating a work', () => {
      it('updates the work successfully', async () => {
        const createWorkParams: CreateWorkRequest = {
          name: 'Obra 1',
          code: 103,
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
          code: expect.any(Number),
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
          code: 104,
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
