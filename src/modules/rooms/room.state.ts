import { find, once, remove } from 'lodash'
import { action, observable } from 'mobx'
import { sound_manager } from '../../util'
import { User } from '../user/user.entity'
import { userState } from '../user/user.state'
import { Message } from './message'
import { Room } from './room.entity'
import { RoomsGateway } from './rooms.gateway'
import { roomsService } from './rooms.service'

class RoomState {
    public gateway!: RoomsGateway

    @observable
    public room: Room | null = null

    @observable
    public unreadMessages: number = 0

    @observable
    public messages_pane_open?: boolean

    private constructor() {}

    public connectGateway() {
        this.gateway = new RoomsGateway()
    }

    @action
    public setMessagesPaneOpen(open: boolean) {
        this.messages_pane_open = open

        if (open) {
            this.unreadMessages = 0
        }
    }

    @action
    public addUser(user: User) {
        if (!find(this.room?.members, { id: user.id }))
            this.room?.members.push(user)
    }

    @action
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

    @action
    public createMessage(message: string) {
        const user = userState.user as User
        this.addMessage({ user, message })
        return this.gateway.createMessage(message)
    }

    @action
    public removeUser(user: User) {
        if (this.room) {
            remove(this.room.members, (_) => _.id === user.id)
        }
    }

    @action
    public getUserRoom(callback?: () => void) {
        if (!userState.user?.room_id) {
            callback?.()
            return
        }

        return roomsService.getCurrentRoom().subscribe({
            next: (response) => {
                if (response.data) {
                    this.room = response.data
                    this.room.messages = []
                } else {
                    this.room = null
                }

                callback?.()
            },
        })
    }

    @action
    public createRoom() {
        if (this.room) return
        return roomsService.createRoom().subscribe({
            next: (response) => {
                if (response.data) {
                    this.room = response.data
                    this.room.messages = []
                    this.gateway.joinRoom(response.data.id)
                }
            },
        })
    }

    @action
    public joinRoom(room_id: string) {
        if (this.room) return
        return roomsService.joinRoom(room_id).subscribe({
            next: (response) => {
                if (response.data) {
                    this.room = response.data
                    this.room.messages = []
                    this.gateway.joinRoom(response.data.id)
                }
            },
        })
    }

    @action
    public leaveRoom() {
        if (!this.room) return
        return roomsService.leaveRoom().subscribe({
            next: (response) => {
                if (response.ok) {
                    this.gateway.leaveRoom()
                    this.room = null
                }
            },
        })
    }

    public static create = once(() => new RoomState())
}

export const roomState = RoomState.create()
