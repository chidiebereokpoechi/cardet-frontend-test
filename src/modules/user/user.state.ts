import { observable } from 'mobx'
import { switchMap, tap } from 'rxjs/operators'
import { ApiUtil } from '../../util/api'
import { User } from './user.entity'
import { userService } from './user.service'

class UserState {
  @observable
  public user: User | null = null

  private constructor() {
    this.start()
  }

  public async fetchUser() {
    userService.getProfile().subscribe({
      next: ({ data: user }) => {
        if (!user) {
          userService
            .create()
            .pipe(
              tap(({ data }) => (this.user = data)),
              switchMap(({ data }) => userService.authenticate(data)),
              tap(({ data }) => ApiUtil.setToken(data.access_token))
            )
            .subscribe()

          return
        }

        this.user = user
      },
    })
  }

  public start() {
    ApiUtil.setToken()
    this.fetchUser()
  }

  public static create() {
    return new UserState()
  }
}

export const userState = UserState.create()
