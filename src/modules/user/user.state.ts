import { once } from 'lodash'
import { action, observable } from 'mobx'
import { switchMap, tap } from 'rxjs/operators'
import { ApiUtil } from '../../util/api'
import { gameManagerState } from '../game'
import { roomState } from '../rooms'
import { rootState } from '../root'
import { User } from './user.entity'
import { userService } from './user.service'

class UserState {
  @observable
  public user: User | null = null

  private constructor() {
    this.start()
  }

  @action
  public initialFetch = once(() => {
    roomState.connectGateway()

    if (!this.user?.room_id) {
      rootState.setReadyState(true)
      return
    }

    roomState.getUserRoom()?.add(this.fetchGameState)
  })

  @action
  public fetchGameState = once(() => {
    gameManagerState.getGameState()?.add(() => rootState.setReadyState(true))
  })

  @action
  public fetchUser() {
    return userService.getProfile().subscribe({
      next: ({ data: user }) => {
        if (!user) {
          userService
            .create()
            .pipe(
              tap(({ data }) => {
                this.user = data
                this.initialFetch()
              }),
              switchMap(({ data }) => userService.authenticate(data)),
              tap(({ data }) => ApiUtil.setToken(data.access_token))
            )
            .subscribe()

          return
        }

        this.user = user
        this.initialFetch()
      },
    })
  }

  public start() {
    ApiUtil.setToken()
    this.fetchUser()
  }

  public static create = once(() => new UserState())
}

export const userState = UserState.create()
