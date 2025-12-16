import { describe, it, expect, beforeEach } from 'vitest'
import { userService, userTypeService } from '../instances'
import type { CreateUserParams } from '../User'
import { db } from '../../database/db'
import { verifyPassword } from '../../utils/passwordHash'

describe('createUser - Integration Tests', () => {
  let testUserTypeId: string

  beforeEach(async () => {
    const userType = await userTypeService.createUserType({ name: 'Visitor' })
    testUserTypeId = userType.id
  })

  describe('when creating a new user', () => {
    it('creates a user in the database with hashed password', async () => {
      const createUserParams: CreateUserParams = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Alexa123!',
        typeUser: testUserTypeId,
      }

      const createdUser = await userService.createUser(createUserParams)

      expect(createdUser).toEqual({
        id: expect.any(String),
        fullName: 'Test User',
        email: 'test@example.com',
        userType: expect.objectContaining({
          id: testUserTypeId,
          name: 'Visitor',
        }),
      })

      const userInDb = await db('users').where({ id: createdUser.id }).first()
      expect(userInDb).toBeDefined()
      expect(userInDb.email).toBe('test@example.com')
      expect(userInDb.type_user_id).toBe(testUserTypeId)

      expect(userInDb.password).not.toBe('Alexa123!')

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
        typeUser: testUserTypeId,
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
        typeUser: '00000000-0000-0000-0000-000000000000',
      }

      await expect(userService.createUser(createUserParams)).rejects.toThrow()
    })
  })
})
