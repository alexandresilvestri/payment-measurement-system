import type { User, UserResponse } from '../models/users'

export async function serializeUser(user: User): Promise<UserResponse> {
  return {
    id: user.id,
    email: user.email,
  }
}
