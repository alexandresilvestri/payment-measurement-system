import { userRepository } from '../repository/users.js'
import { userTypeRepository } from '../repository/userTypes.js'
import { workRepository } from '../repository/works.js'
import { supplierRepository } from '../repository/suppliers.js'
import { contractRepository } from '../repository/contracts.js'
import { refreshTokenRepository } from '../repository/refreshTokens.js'
import { UserService } from './User.js'
import { UserTypeService } from './UserType.js'
import { WorkService } from './Work.js'
import { SupplierService } from './Supplier.js'
import { ContractService } from './Contract.js'
import { AuthService } from './Auth.js'

export const userService = new UserService(userRepository, userTypeRepository)
export const userTypeService = new UserTypeService(userTypeRepository)
export const workService = new WorkService(workRepository)
export const supplierService = new SupplierService(supplierRepository)
export const contractService = new ContractService(
  contractRepository,
  workRepository,
  supplierRepository
)
export const authService = new AuthService(
  userRepository,
  userTypeRepository,
  refreshTokenRepository
)
