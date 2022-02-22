import { User } from '../user/user.entity'

export interface Message {
    user: User
    message: string
}
