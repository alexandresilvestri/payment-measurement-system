import { describe, it, expect, beforeEach } from 'vitest'
import { userService, userTypeService } from '../instances'
import type { CreateUserParams } from '../User'
import type { UpdateUserRequest } from '../../types/api/users'
import { db } from '../../database/db'
import { verifyPassword } from '../../utils/passwordHash'

describe('UserService - updateUser', () => {
  let testUserTypeId: string
  let adminUserTypeId: string
  let testUserId: string

  beforeEach(async () => {
    const managerType = await userTypeService.createUserType({
      name: 'Manager',
    })
    const adminType = await userTypeService.createUserType({ name: 'Admin' })
    testUserTypeId = managerType.id
    adminUserTypeId = adminType.id

    const createUserParams: CreateUserParams = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'SecurePass123!',
      typeUser: testUserTypeId,
    }

    const createdUser = await userService.createUser(createUserParams)
    testUserId = createdUser.id
  })

  it('should update a single field', async () => {
    const updates: UpdateUserRequest = {
      firstName: 'Jane',
    }

    const result = await userService.updateUser(testUserId, updates)

    expect(result).toMatchObject({
      id: testUserId,
      fullName: 'Jane Doe',
      email: 'john.doe@example.com',
    })

    const userInDb = await db('users').where({ id: testUserId }).first()
    expect(userInDb.first_name).toBe('Jane')
    expect(userInDb.last_name).toBe('Doe')
  })

  it('should update multiple fields at once', async () => {
    const updates: UpdateUserRequest = {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      typeUser: adminUserTypeId,
    }

    const result = await userService.updateUser(testUserId, updates)

    expect(result).toMatchObject({
      id: testUserId,
      fullName: 'Jane Smith',
      email: 'jane.smith@example.com',
    })
    expect(result?.userType).toMatchObject({
      id: adminUserTypeId,
      name: 'Admin',
    })

    const userInDb = await db('users').where({ id: testUserId }).first()
    expect(userInDb.first_name).toBe('Jane')
    expect(userInDb.last_name).toBe('Smith')
    expect(userInDb.email).toBe('jane.smith@example.com')
    expect(userInDb.type_user_id).toBe(adminUserTypeId)
  })

  it('should hash password when updating', async () => {
    const newPassword = 'NewSecure456!'
    const updates: UpdateUserRequest = {
      password: newPassword,
    }

    await userService.updateUser(testUserId, updates)

    const userInDb = await db('users').where({ id: testUserId }).first()
    expect(userInDb.password).not.toBe(newPassword)

    const isValidPassword = await verifyPassword(userInDb.password, newPassword)
    expect(isValidPassword).toBe(true)
  })

  it('should normalize and trim input data', async () => {
    const updates: UpdateUserRequest = {
      firstName: '  Jane  ',
      email: '  UPPERCASE@EXAMPLE.COM  ',
    }

    const result = await userService.updateUser(testUserId, updates)

    expect(result).toMatchObject({
      fullName: 'Jane Doe',
      email: 'uppercase@example.com',
    })

    const userInDb = await db('users').where({ id: testUserId }).first()
    expect(userInDb.first_name).toBe('Jane')
    expect(userInDb.email).toBe('uppercase@example.com')
  })

  it('should return user unchanged when updates object is empty', async () => {
    const updates: UpdateUserRequest = {}

    const result = await userService.updateUser(testUserId, updates)

    expect(result).toMatchObject({
      id: testUserId,
      fullName: 'John Doe',
      email: 'john.doe@example.com',
    })
  })

  it('should return null when user does not exist', async () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    const updates: UpdateUserRequest = {
      firstName: 'Ghost',
    }

    const result = await userService.updateUser(nonExistentId, updates)

    expect(result).toBeNull()
  })

  it('should not modify fields that are not in the updates', async () => {
    const updates: UpdateUserRequest = {
      firstName: 'UpdatedName',
    }

    await userService.updateUser(testUserId, updates)

    const userInDb = await db('users').where({ id: testUserId }).first()

    expect(userInDb.first_name).toBe('UpdatedName')
    expect(userInDb.last_name).toBe('Doe')
    expect(userInDb.email).toBe('john.doe@example.com')
    expect(userInDb.type_user_id).toBe(testUserTypeId)

    const isOriginalPassword = await verifyPassword(
      userInDb.password,
      'SecurePass123!'
    )
    expect(isOriginalPassword).toBe(true)
  })
})
