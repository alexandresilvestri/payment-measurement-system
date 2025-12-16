import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../passwordHash'

describe('passwordHash', () => {
  describe('#hashPassword', () => {
    it('returns a hash', async () => {
      const password = 'Alexa123'
      const hash = await hashPassword(password)

      console.log(hash)
      expect(hash).toMatch('argon2id$v=19$m=65536,t=3,p=4$')
    })
  })

  describe('when the password is valid', () => {
    const matchingPassword = 'Alexa123'
    const validHash =
      '$argon2id$v=19$m=65536,t=3,p=4$+WV8ND51qUPuKzz+qm2GQw$K9dW895VGshc0T0wJ+181JDcpzz/yzzkCzv/QavzsaY'

    describe('when the password is valid', () => {
      it('returns true', async () => {
        const isValid = await verifyPassword(validHash, matchingPassword)

        expect(isValid).toBe(true)
      })
    })
  })
})
