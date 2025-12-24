import { find, once, remove } from 'lodash'
import { action, makeAutoObservable, observable } from 'mobx'
import { sound_manager } from '../../util'
import { User } from '../user/user.entity'
import { userState } from '../user/user.state'
import { Message } from './message'
import { GameConfig, Room } from './types'
import { RoomsGateway } from './gateway'
import { roomsService } from './service'

class RoomState {
    public gateway!: RoomsGateway

    @observable
    public room: Room | null = null

    @observable
    public unreadMessages: number = 0

    @observable
    public messages_pane_open?: boolean

    public isSettingsPaneOpen: boolean = false

    private constructor() {
        makeAutoObservable(this)
    }

    public connectGateway() {
        this.gateway = new RoomsGateway()
    }

    public setRoom(room: Room | null) {
        this.room = room
    }

    public setMessagesPaneOpen(open: boolean) {
        this.messages_pane_open = open

        if (open) {
            this.unreadMessages = 0
        }
    }

    public setIsSettingsPaneOpen(open: boolean) {
        this.isSettingsPaneOpen = open
    }

    public changeGameConfig(config: GameConfig) {
        if (!this.room) return
        return roomsService.changeGameConfig(config).subscribe({
            next: (response) => {
                if (response.data) {
                    this.setRoom({ ...response.data })
                    this.gateway.updateRoom()
                }
            },
        })
    }

    public addUser(user: User) {
        if (!find(this.room?.members, { id: user.id }))
            this.room?.members.push(user)
    }

    public addMessage(message: Message) {
        if (!this.room) return

        this.room.messages = [...(this.room?.messages ?? []), message]

        if (message.user.id !== userState.user?.id) {
            sound_manager.newMessage()

            if (!this.messages_pane_open) {
                this.unreadMessages += 1
            }
        }
    }

    public createMessage(message: string) {
        const user = userState.user as User
        this.addMessage({ user, message })
        return this.gateway.createMessage(message)
    }

    public removeUser(user: User) {
        if (this.room) {
            remove(this.room.members, (_) => _.id === user.id)
        }
    }

    public getUserRoom(callback?: () => void) {
        if (!userState.user?.room_id) {
            callback?.()
            return
        }

        return roomsService.getCurrentRoom().subscribe({
            next: (response) => {
                this.setRoom(response.data ?? null)

                callback?.()
            },
        })
    }

    public createRoom() {
        if (this.room) return
        return roomsService.createRoom().subscribe({
            next: (response) => {
                if (response.data) {
                    this.setRoom({ ...response.data, messages: [] })
                    this.gateway.joinRoom(response.data.id)
                }
            },
        })
    }

    public joinRoom(room_id: string) {
        if (this.room) return
        return roomsService.joinRoom(room_id).subscribe({
            next: (response) => {
                if (response.data) {
                    this.setRoom(response.data)
                    this.gateway.joinRoom(response.data.id)
                }
            },
        })
    }

    public leaveRoom() {
        if (!this.room) return
        return roomsService.leaveRoom().subscribe({
            next: (response) => {
                if (response.ok) {
                    this.gateway.leaveRoom()
                    this.setRoom(null)
                }
            },
        })
    }

    public static create = once(() => new RoomState())
}

export const roomState = RoomState.create()
