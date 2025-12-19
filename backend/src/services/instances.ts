import { userRepository } from '../repository/users'
import { userTypeRepository } from '../repository/userTypes'
import { workRepository } from '../repository/works'
import { UserService } from './User'
import { UserTypeService } from './UserType'
import { WorkService } from './Work'
import { supplierRepository } from '../repository/suppliers'
import { SupplierService } from './Supplier'

export const userService = new UserService(userRepository, userTypeRepository)
export const userTypeService = new UserTypeService(userTypeRepository)
export const workService = new WorkService(workRepository)
export const supplierService = new SupplierService(supplierRepository)
