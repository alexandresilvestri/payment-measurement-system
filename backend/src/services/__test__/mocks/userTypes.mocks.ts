import { UserType } from '../../../models/users/userTypes'

export const MOCK_USER_TYPE_ADMIN: UserType = {
  id: '21ba5706-ebca-4bf3-bc78-85ae37000eb7',
  name: 'Admin',
}

export const MOCK_USER_TYPE_VISITOR: UserType = {
  id: '9ee534d9-fa4d-446b-939f-3b83a8fa2da2',
  name: 'Visitor',
}

export const MOCK_USER_TYPES: UserType[] = [
  MOCK_USER_TYPE_ADMIN,
  MOCK_USER_TYPE_VISITOR,
]
