import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createUserType, CreateUserTypeParams } from '../createUserType'
import { userTypeRepository } from '../../repository/userTypes'
import { MOCK_USER_TYPE_ADMIN } from './mocks/userTypes.mocks'

vi.mock('../../repository/userTypes', () => ({
  userTypeRepository: {
    createUserType: vi.fn(),
    findById: vi.fn(),
  },
}))

describe('create user type', () => {
  const createUserTypeParams: CreateUserTypeParams = {
    name: MOCK_USER_TYPE_ADMIN.name,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when the user type doesnt not exitsts', () => {
    it('returns an user type', async () => {
      vi.mocked(userTypeRepository.createUserType).mockResolvedValue(undefined)
      vi.mocked(userTypeRepository.findById).mockResolvedValue(
        MOCK_USER_TYPE_ADMIN
      )
      const createdUserType = await createUserType(createUserTypeParams)

      expect(userTypeRepository.createUserType).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          name: MOCK_USER_TYPE_ADMIN.name,
        })
      )
      expect(userTypeRepository.findById).toHaveBeenCalledWith(
        expect.any(String)
      )
      expect(createdUserType).toEqual({
        id: expect.any(String),
        name: MOCK_USER_TYPE_ADMIN.name,
      })
    })
  })
})
