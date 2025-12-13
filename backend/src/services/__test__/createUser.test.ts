import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createUser, CreateUserParams } from '../createUser'
import { userRepository } from '../../repository/users'
import { userTypeRepository } from '../../repository/userTypes'
import { MOCK_USER_VISITOR } from './mocks/user.mocks'
import { MOCK_USER_TYPE_VISITOR } from './mocks/userTypes.mocks'

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
    email: MOCK_USER_VISITOR.email,
    password: 'Alexa123',
    type_user_id: MOCK_USER_TYPE_VISITOR.id,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when the user doesnt not exists', () => {
    it('returns an user', async () => {
      vi.mocked(userRepository.createUser).mockResolvedValue(undefined)
      vi.mocked(userRepository.findById).mockResolvedValue(MOCK_USER_VISITOR)
      vi.mocked(userTypeRepository.findById).mockResolvedValue(
        MOCK_USER_TYPE_VISITOR
      )
      const createdUser = await createUser(createUserParams)

      expect(userRepository.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          email: MOCK_USER_VISITOR.email,
          password: expect.any(String),
        })
      )
      expect(userRepository.findById).toHaveBeenCalledWith(expect.any(String))
      expect(userTypeRepository.findById).toHaveBeenCalledWith(
        MOCK_USER_TYPE_VISITOR.id
      )
      expect(createdUser).toEqual({
        id: expect.any(String),
        email: MOCK_USER_VISITOR.email,
        userType: MOCK_USER_TYPE_VISITOR,
      })
    })
  })
})
