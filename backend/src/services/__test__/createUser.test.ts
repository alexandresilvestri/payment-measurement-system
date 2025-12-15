import { describe, it, expect, beforeEach, vi } from 'vitest'
import { UserService, CreateUserParams } from '../createUser'
import { userRepository } from '../../repository/users'
import { userTypeRepository } from '../../repository/userTypes'
import { MOCK_USER_ADMIN } from './mocks/user.mocks'
import { MOCK_USER_TYPE_ADMIN } from './mocks/userTypes.mocks'

vi.mock('../../repository/users', () => ({
  userRepository: {
    createUser: vi.fn(),
    findById: vi.fn(),
  },
}))

vi.mock('../../repository/userTypes', () => ({
  userTypeRepository: {
    findById: vi.fn(),
  },
}))

describe('create user', () => {
  const createUserParams: CreateUserParams = {
    firstName: MOCK_USER_ADMIN.firstName,
    lastName: MOCK_USER_ADMIN.lastName,
    email: MOCK_USER_ADMIN.email,
    password: 'Alexa123!',
    typeUser: MOCK_USER_TYPE_ADMIN.id,
  }

  let userService: UserService

  beforeEach(() => {
    vi.clearAllMocks()
    userService = new UserService(userRepository, userTypeRepository)
  })

  describe('when the user doesnt not exists', () => {
    it('returns an user', async () => {
      vi.mocked(userRepository.createUser).mockResolvedValue(undefined)
      vi.mocked(userRepository.findById).mockResolvedValue(MOCK_USER_ADMIN)
      vi.mocked(userTypeRepository.findById).mockResolvedValue(
        MOCK_USER_TYPE_ADMIN
      )
      const createdUser = await userService.createUser(createUserParams)

      expect(userRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          firstName: MOCK_USER_ADMIN.firstName,
          lastName: MOCK_USER_ADMIN.lastName,
          email: MOCK_USER_ADMIN.email,
          passwordHash: expect.any(String),
        })
      )
      expect(userRepository.findById).toHaveBeenCalledWith(expect.any(String))
      expect(userTypeRepository.findById).toHaveBeenCalledWith(
        MOCK_USER_TYPE_ADMIN.id
      )
      expect(createdUser).toEqual({
        id: expect.any(String),
        fullName: `${MOCK_USER_ADMIN.firstName} ${MOCK_USER_ADMIN.lastName}`,
        email: MOCK_USER_ADMIN.email,
        userType: MOCK_USER_TYPE_ADMIN,
      })
    })
  })
})
