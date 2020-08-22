import { once } from 'lodash'
import { observable } from 'mobx'
import { userState } from '../user'
import { Room } from './room.entity'
import { roomsService } from './rooms.service'

class RoomState {
  @observable
  public room: Room | null = null

  private constructor() {}

  public getUserRoom() {
    if (!userState.user?.room_id) return
    return roomsService.getCurrentRoom().subscribe({
      next: (response) => {
        if (response.ok) this.room = response.data
      },
    })
  }

  public createRoom() {
    if (this.room) return
    return roomsService.createRoom().subscribe({
      next: (response) => {
        if (response.ok) this.room = response.data
      },
    })
  }

  public joinRoom(room_id: string) {
    if (this.room) return
    return roomsService.joinRoom(room_id).subscribe({
      next: (response) => {
        if (response.ok) this.room = response.data
      },
    })
  }

  public leaveRoom() {
    if (!this.room) return
    return roomsService.leaveRoom().subscribe({
      next: (response) => {
        if (response.ok) this.room = null
      },
    })
  }

  public static create() {
    return once(() => new RoomState())()
  }
}

export const roomState = RoomState.create()
