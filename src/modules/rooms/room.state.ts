import { find, once, remove } from 'lodash'
import { action, observable } from 'mobx'
import { User, userState } from '../user'
import { Room } from './room.entity'
import { RoomsGateway } from './rooms.gateway'
import { roomsService } from './rooms.service'

class RoomState {
  public gateway!: RoomsGateway

  @observable
  public room: Room | null = null

  private constructor() {}

  public connectGateway() {
    this.gateway = new RoomsGateway()
  }

  @action
  public addUser(user: User) {
    if (!find(this.room?.members, { id: user.id }))
      this.room?.members.push(user)
  }

  @action
  public removeUser(user: User) {
    if (this.room) {
      remove(this.room.members, (_) => _.id === user.id)
    }
  }

  @action
  public getUserRoom() {
    if (!userState.user?.room_id) return
    return roomsService.getCurrentRoom().subscribe({
      next: (response) => {
        if (response.ok) {
          this.room = response.data
          return
        }

        this.room = null
      },
    })
  }

  @action
  public createRoom() {
    if (this.room) return
    return roomsService.createRoom().subscribe({
      next: (response) => {
        if (response.ok) {
          this.room = response.data
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
        if (response.ok) {
          this.room = response.data
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
