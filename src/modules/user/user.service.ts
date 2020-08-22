import { HttpClient } from '../../util/api'
import { UpdateUserModel } from './models'
import { User } from './user.entity'
import { userState } from './user.state'

class UserService {
  public getProfile() {
    return HttpClient.get<User>('auth')
  }

  public authenticate(user: User) {
    return HttpClient.post<User, { access_token: string }>('auth', user)
  }

  public create() {
    return HttpClient.post<never, User>('users')
  }

  public retrieve() {
    return HttpClient.get<User>(`users/${userState.user?.id}`)
  }

  public update(model: UpdateUserModel) {
    return HttpClient.patch<UpdateUserModel, User>(
      `users/${userState.user?.id}`,
      model
    )
  }
}

export const userService = new UserService()
