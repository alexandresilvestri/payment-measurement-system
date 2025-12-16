import { describe, it, expect } from 'vitest'
import { workService } from '../instances'
import type { CreateWorkRequest } from '../../types/works'
import { db } from '../../database/db'

describe('createWork - Integration Tests', () => {
  describe('when creating a new work', () => {
    it('creates a work in the database with all fields', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Construction Project Alpha',
        code: 'CP-001',
        address: '123 Main Street, City, State',
        contractor: 'ABC Construction Company',
        status: 'ATIVA',
      }

      const createdWork = await workService.createWork(createWorkParams)

      expect(createdWork).toEqual({
        id: expect.any(String),
        name: 'Construction Project Alpha',
        code: 'CP-001',
        address: '123 Main Street, City, State',
        contractor: 'ABC Construction Company',
        status: 'ATIVA',
      })

      const workInDb = await db('works').where({ id: createdWork.id }).first()
      expect(workInDb).toBeDefined()
      expect(workInDb.name).toBe('Construction Project Alpha')
      expect(workInDb.code).toBe('CP-001')
      expect(workInDb.address).toBe('123 Main Street, City, State')
      expect(workInDb.contractor).toBe('ABC Construction Company')
      expect(workInDb.status).toBe('ATIVA')
    })

    it('creates a work with only required fields', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Minimal Work Project',
        address: '456 Secondary Ave',
      }

      const createdWork = await workService.createWork(createWorkParams)

      expect(createdWork).toEqual({
        id: expect.any(String),
        name: 'Minimal Work Project',
        code: null,
        address: '456 Secondary Ave',
        contractor: null,
        status: 'ATIVA',
      })

      const workInDb = await db('works').where({ id: createdWork.id }).first()
      expect(workInDb).toBeDefined()
      expect(workInDb.name).toBe('Minimal Work Project')
      expect(workInDb.code).toBeNull()
      expect(workInDb.address).toBe('456 Secondary Ave')
      expect(workInDb.contractor).toBeNull()
      expect(workInDb.status).toBe('ATIVA')
    })

    it('creates a work with CONCLUIDA status', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Completed Work',
        address: '789 Finished Road',
        status: 'CONCLUIDA',
      }

      const createdWork = await workService.createWork(createWorkParams)

      expect(createdWork.status).toBe('CONCLUIDA')

      const workInDb = await db('works').where({ id: createdWork.id }).first()
      expect(workInDb.status).toBe('CONCLUIDA')
    })
  })

  describe('when getting a work by id', () => {
    it('returns the work if it exists', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Test Work for Retrieval',
        address: '321 Test Street',
      }

      const createdWork = await workService.createWork(createWorkParams)
      const retrievedWork = await workService.getWorkById(createdWork.id)

      expect(retrievedWork).toEqual(createdWork)
    })

    it('returns null if work does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'
      const retrievedWork = await workService.getWorkById(nonExistentId)

      expect(retrievedWork).toBeNull()
    })
  })

  describe('when updating a work', () => {
    it('updates the work successfully', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Original Work Name',
        address: 'Original Address',
      }

      const createdWork = await workService.createWork(createWorkParams)

      const updatedWork = await workService.updateWork(createdWork.id, {
        name: 'Updated Work Name',
        address: 'Updated Address',
        contractor: 'New Contractor',
      })

      expect(updatedWork).toEqual({
        id: createdWork.id,
        name: 'Updated Work Name',
        code: null,
        address: 'Updated Address',
        contractor: 'New Contractor',
        status: 'ATIVA',
      })

      const workInDb = await db('works').where({ id: createdWork.id }).first()
      expect(workInDb.name).toBe('Updated Work Name')
      expect(workInDb.address).toBe('Updated Address')
      expect(workInDb.contractor).toBe('New Contractor')
    })

    it('throws an error if work does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000'

      await expect(
        workService.updateWork(nonExistentId, {
          name: 'Updated Name',
        })
      ).rejects.toThrow('Work not found')
    })
  })

  describe('when deleting a work', () => {
    it('deletes the work successfully', async () => {
      const createWorkParams: CreateWorkRequest = {
        name: 'Work to Delete',
        address: 'Delete Street',
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
