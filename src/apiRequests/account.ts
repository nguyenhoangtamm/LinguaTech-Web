import http from '@/lib/http'
import {
  UserResType
} from '@/schemaValidations/user.schema'

const userApiRequest = {
  me: () => http.get<UserResType>('users/me'),

}

export default userApiRequest
