import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createUser, CreateUserParams } from '../createUser'
import { userRepository } from '../../repository/users'

vi.mock('../../repository/users', () => ({
  userRepository: {
    saveUser: vi.fn(),
    findById: vi.fn(),
  },
}))

describe('create user', () => {
  const createUserParams: CreateUserParams = {
    email: 'alexandre@mail.com',
    password: 'Alexa123',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when the user doesnt not exists', () => {
    it('returns an user', async () => {
      const mockUser = {
        id: expect.any(String),
        email: createUserParams.email,
        passwordHash: expect.any(String),
      }

      vi.mocked(userRepository.saveUser).mockResolvedValue(undefined)
      vi.mocked(userRepository.findById).mockResolvedValue(mockUser)
      const createdUser = await createUser(createUserParams)

      expect(userRepository.saveUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          email: createUserParams.email,
          password: expect.any(String),
        })
      )
      expect(userRepository.findById).toHaveBeenCalledWith(expect.any(String))
      expect(createdUser).toEqual({
        id: expect.any(String),
        email: createUserParams.email,
      })
    })
  })
})
