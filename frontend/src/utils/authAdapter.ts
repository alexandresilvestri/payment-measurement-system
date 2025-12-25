import { AuthUser } from '../types/auth'
import { User, UserRole } from '../types'

/**
 * Maps backend userType to frontend UserRole
 * Uses permissions.approveMeasurement as a hint for role determination
 */
export const mapUserTypeToRole = (authUser: AuthUser): UserRole => {
  // Use permissions to determine role
  // Users with approveMeasurement permission are directors
  if (authUser.permissions?.approveMeasurement) {
    return 'DIRETOR'
  }

  // Default to OBRA for other users
  return 'OBRA'
}

/**
 * Converts backend AuthUser to frontend User format
 * This adapter maintains backward compatibility with existing components
 */
export const convertAuthUserToUser = (authUser: AuthUser): User => {
  return {
    id: authUser.id,
    name: `${authUser.firstName} ${authUser.lastName}`.trim(),
    email: authUser.email,
    role: mapUserTypeToRole(authUser),
    linkedConstructionSiteIds: authUser.linkedConstructionSiteIds,
  }
}
