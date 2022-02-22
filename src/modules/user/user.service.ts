import { HttpClient } from '../../util/api'
import { UpdateUserModel } from './models'
import { User } from './user.entity'

class UserService {
    public getProfile() {
        return HttpClient.get<User>('auth')
    }

    public authenticate(user: User) {
        return HttpClient.post<User, { access_token: string }>('auth', user)
    }

    public create() {
        return HttpClient.post<never, User>('users', undefined, false)
    }

    public retrieve(id: string) {
        return HttpClient.get<User>(`users/${id}`)
    }

    public update(model: UpdateUserModel, id: string) {
        return HttpClient.patch<UpdateUserModel, User>(
            `users/${id}`,
            model,
            false,
        )
    }
}

export const userService = new UserService()
