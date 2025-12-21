import { once } from 'lodash'
import { action, observable } from 'mobx'
import { switchMap, tap } from 'rxjs/operators'
import { ApiUtil } from '../../util/api'
import { gameManager } from '../game'
import { roomState } from '../rooms'
import { rootState } from '../root'
import { UpdateUserModel } from './models'
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

        const sub = roomState.getUserRoom(() => rootState.setReadyState(true))
        if (sub !== undefined) sub.add(this.fetchGameState)
    })

    @action
    public fetchGameState = once(() => {
        gameManager.getGameState()?.add(() => rootState.setReadyState(true))
    })

    @action
    public createUser() {
        userService
            .create()
            .pipe(
                tap(({ data }) => {
                    this.user = data
                    this.initialFetch()
                }),
                switchMap(({ data }) => userService.authenticate(data)),
                tap(({ data }) => ApiUtil.setToken(data.access_token)),
            )
            .subscribe()

        return
    }

    @action
    public fetchUser() {
        return userService.getProfile().subscribe({
            next: ({ data: user }) => {
                if (!user) {
                    this.createUser()
                    return
                }

                this.user = user
                this.initialFetch()
            },
            error: () => {
                this.createUser()
            },
        })
    }

    @action
    public updateUser(model: UpdateUserModel) {
        return userService.update(model, this.user!.id).subscribe({
            next: (response) => {
                if (response.data) {
                    this.user = response.data
                }
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
