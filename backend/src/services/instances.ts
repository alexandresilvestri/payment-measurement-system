/**
 * Service instances with dependency injection
 * This file creates and exports singleton instances of services
 * with their dependencies injected
 */

import { userRepository } from '../repository/users'
import { userTypeRepository } from '../repository/userTypes'
import { UserService } from './createUser'
import { UserTypeService } from './createUserType'

// Create UserService instance with injected dependencies
export const userService = new UserService(userRepository, userTypeRepository)

// Create UserTypeService instance with injected dependencies
export const userTypeService = new UserTypeService(userTypeRepository)
