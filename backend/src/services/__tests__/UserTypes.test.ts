import { describe, it, expect } from 'vitest'
import { userTypeService } from '../instances'
import type { CreateUserTypeParams, UpdateUserTypeParams } from '../UserType'
import { db } from '../../database/db'

describe('User Type - crud integration tests', () => {
  describe('when creating a new user type', () => {
    it('creates a user type in the database', async () => {
      const createUserTypeParams: CreateUserTypeParams = {
        name: 'Administrador',
        approveMeasurement: true,
      }

      const createdUserType =
        await userTypeService.createUserType(createUserTypeParams)

      expect(createdUserType).toEqual({
        id: expect.any(String),
        name: 'Administrador',
        approveMeasurement: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })

      const userTypeInDb = await db('user_types')
        .where({ id: createdUserType.id })
        .first()

      expect(userTypeInDb).toBeDefined()
      expect(userTypeInDb.name).toBe('Administrador')
    })
  })

  describe('when the user type name already exists', () => {
    it('throws an error', async () => {
      const createUserTypeParams: CreateUserTypeParams = {
        name: 'Supervisor',
        approveMeasurement: false,
      }

      await userTypeService.createUserType(createUserTypeParams)

      await expect(
        userTypeService.createUserType(createUserTypeParams)
      ).rejects.toThrow('User type already exists')
    })
  })

  describe('when updates user type', () => {
    it('updates user type', async () => {
      const userType = {
        name: 'Engenheiro',
        approveMeasurement: true,
      }

      const createdUserType = await userTypeService.createUserType(userType)

      const updateUserTypeParams: UpdateUserTypeParams = {
        name: 'Administrador',
      }

      expect(
        await userTypeService.updateUserType(
          createdUserType.id,
          updateUserTypeParams
        )
      ).toEqual({
        id: expect.any(String),
        name: 'Administrador',
        approveMeasurement: true,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })

  describe('when delete user type', () => {
    it('deletes user type', async () => {
      const userType = {
        name: 'Diretor',
        approveMeasurement: true,
      }

      const createdUserType = await userTypeService.createUserType(userType)

      await userTypeService.deleteUserType(createdUserType.id)

      expect(await userTypeService.getUserTypeById(createdUserType.id)).toEqual(
        null
      )
    })
  })
})
