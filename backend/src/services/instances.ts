import { userRepository } from '../repository/users'
import { userTypeRepository } from '../repository/userTypes'
import { workRepository } from '../repository/works'
import { UserService } from './User'
import { UserTypeService } from './UserType'
import { WorkService } from './Work'

export const userService = new UserService(userRepository, userTypeRepository)

export const userTypeService = new UserTypeService(userTypeRepository)

export const workService = new WorkService(workRepository)
