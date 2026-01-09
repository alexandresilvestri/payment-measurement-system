import { AuthUser } from '../types/auth'
import { User, UserRole } from '../types'

export const mapUserTypeToRole = (authUser: AuthUser): UserRole => {
  if (authUser.permissions?.approveMeasurement) {
    return 'DIRETOR'
  }

  return 'OBRA'
}

export const convertAuthUserToUser = (authUser: AuthUser): User => {
  return {
    id: authUser.id,
    name: `${authUser.firstName} ${authUser.lastName}`.trim(),
    email: authUser.email,
    role: mapUserTypeToRole(authUser),
  }
}
