import { UpdateUserRequest } from '../../types/api/users.js'
import { hashPassword } from '../passwordHash.js'

export async function mapUpdateUserRequestToDb(
  updates: UpdateUserRequest
): Promise<{
  first_name?: string
  last_name?: string
  email?: string
  password?: string
  type_user_id?: string
}> {
  const dbUpdates: {
    first_name?: string
    last_name?: string
    email?: string
    password?: string
    type_user_id?: string
  } = {}

  if (updates.firstName !== undefined) {
    dbUpdates.first_name = updates.firstName.trim()
  }
  if (updates.lastName !== undefined) {
    dbUpdates.last_name = updates.lastName.trim()
  }
  if (updates.email !== undefined) {
    dbUpdates.email = updates.email.trim().toLowerCase()
  }
  if (updates.password !== undefined) {
    dbUpdates.password = await hashPassword(updates.password)
  }
  if (updates.userType !== undefined) {
    dbUpdates.type_user_id = updates.userType
  }

  return dbUpdates
}
