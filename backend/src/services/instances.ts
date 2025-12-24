import { userRepository } from '../repository/users'
import { userTypeRepository } from '../repository/userTypes'
import { workRepository } from '../repository/works'
import { supplierRepository } from '../repository/suppliers'
import { refreshTokenRepository } from '../repository/refreshTokens'
import { UserService } from './User'
import { UserTypeService } from './UserType'
import { WorkService } from './Work'
import { SupplierService } from './Supplier'
import { AuthService } from './Auth'

export const userService = new UserService(userRepository, userTypeRepository)
export const userTypeService = new UserTypeService(userTypeRepository)
export const workService = new WorkService(workRepository)
export const supplierService = new SupplierService(supplierRepository)
export const authService = new AuthService(
  userRepository,
  userTypeRepository,
  refreshTokenRepository
)
