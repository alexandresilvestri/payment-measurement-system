import { MOCK_USER_TYPE_ADMIN, MOCK_USER_TYPE_VISITOR } from './userTypes.mocks'
import { User } from '../../../models/users/users'

export const MOCK_USER_ADMIN: User = {
  id: '9ee534d9-fa4d-446b-939f-3b83a8fa2da2',
  email: 'mauricio@mail.com',
  passwordHash:
    '$argon2id$v=19$m=65536,t=3,p=4$vrtPYWHpYaMiAYvebR4htg$9WhppOesu2sIgQLpWaSFqqGvF1z8/1Aw7RL/wRaTXBo',
  userType: MOCK_USER_TYPE_ADMIN.id,
}

export const MOCK_USER_VISITOR: User = {
  id: '21ba5706-ebca-4bf3-bc78-85ae37000eb7',
  email: 'alexandre@mail.com',
  passwordHash:
    '$argon2id$v=19$m=65536,t=3,p=4$ihzNN2LBOdha1IR9RTQQYA$uOcbXCBVOJREFokz+8/b8aGLCu/TwfXLFjy/LgVG7zY',
  userType: MOCK_USER_TYPE_VISITOR.id,
}
