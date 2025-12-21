import { describe, it, expect, beforeEach } from 'vitest'
import { userService, userTypeService } from '../instances'
import type { CreateUserParams, UpdateUserParams } from '../User'
import { db } from '../../database/db'
import { verifyPassword } from '../../utils/passwordHash'

describe('User - integration crud tests', () => {
  let testUserTypeId: string

  beforeEach(async () => {
    const userType = await userTypeService.createUserType({
      name: 'Visitor',
      approveMeasurement: false,
    })
    testUserTypeId = userType.id
  })

  describe('when creating a new user', () => {
    it('creates a user in the database with hashed password', async () => {
      const createUserParams: CreateUserParams = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Alexa123!',
        userType: testUserTypeId,
      }

      const createdUser = await userService.createUser(createUserParams)

      expect(createdUser).toEqual({
        id: expect.any(String),
        fullName: 'Test User',
        email: 'test@example.com',
        userType: expect.objectContaining({
          id: testUserTypeId,
          name: 'Visitor',
          approveMeasurement: false,
        }),
      })

      const userInDb = await db('users').where({ id: createdUser.id }).first()

      const isValidPassword = await verifyPassword(
        userInDb.password,
        'Alexa123!'
      )
      expect(isValidPassword).toBe(true)
    })
  })

  describe('when the email already exists', () => {
    it('throws an error', async () => {
      const createUserParams: CreateUserParams = {
        firstName: 'Duplicate',
        lastName: 'User',
        email: 'duplicate@example.com',
        password: 'Password123!',
        userType: testUserTypeId,
      }

      await userService.createUser(createUserParams)

      await expect(userService.createUser(createUserParams)).rejects.toThrow(
        'Email already exists'
      )
    })
  })

  describe('when the user type does not exist', () => {
    it('throws an error', async () => {
      const createUserParams: CreateUserParams = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password123!',
        userType: '00000000-0000-0000-0000-000000000000',
      }

      await expect(userService.createUser(createUserParams)).rejects.toThrow()
    })
  })

  describe('when the update user', () => {
    it('update user', async () => {
      const createUserParams: CreateUserParams = {
        firstName: 'Current',
        lastName: 'Middle',
        email: 'test@main.com',
        password: 'Teste123!',
        userType: testUserTypeId,
      }

      const createUser = await userService.createUser(createUserParams)

      const updateUserParams: UpdateUserParams = {
        firstName: 'Updated',
        lastName: 'Last',
      }

      await userService.updateUser(createUser.id, updateUserParams)

      expect(await userService.getUserById(createUser.id)).toEqual({
        id: expect.any(String),
        fullName: 'Updated Last',
        email: 'test@main.com',
        userType: expect.objectContaining({
          id: expect.any(String),
          name: 'Visitor',
          approveMeasurement: false,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      })
    })
  })
})
