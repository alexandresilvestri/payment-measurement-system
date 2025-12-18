import { describe, it, expect } from 'vitest'
import { userTypeService } from '../instances'
import type { CreateUserTypeParams, UpdateUserTypeParams } from '../UserType'
import { db } from '../../database/db'

describe('User Type - crud integration tests', () => {
  describe('when creating a new user type', () => {
    it('creates a user type in the database', async () => {
      const createUserTypeParams: CreateUserTypeParams = {
        name: 'Admin',
      }

      const createdUserType =
        await userTypeService.createUserType(createUserTypeParams)

      expect(createdUserType).toEqual({
        id: expect.any(String),
        name: 'Admin',
      })

      const userTypeInDb = await db('user_types')
        .where({ id: createdUserType.id })
        .first()

      expect(userTypeInDb).toBeDefined()
      expect(userTypeInDb.name).toBe('Admin')
    })
  })

  describe('when the user type name already exists', () => {
    it('throws an error', async () => {
      const createUserTypeParams: CreateUserTypeParams = {
        name: 'Supervisor',
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
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      })
    })
  })

  describe('when delete user type', () => {
    it('deletes user type', async () => {
      const userType = {
        name: 'Diretor',
      }

      const createdUserType = await userTypeService.createUserType(userType)

      await userTypeService.deleteUserType(createdUserType.id)

      expect(await userTypeService.getUserTypeById(createdUserType.id)).toEqual(
        null
      )
    })
  })
})
