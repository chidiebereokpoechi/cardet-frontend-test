import { SubscribeMessage, WsEventHandler, WsGateway } from '../../util/api'
import { User, userState } from '../user'
import { Room } from './room.entity'
import { roomState } from './room.state'

@WsGateway('rooms')
export class RoomsGateway {
  public readonly handler!: WsEventHandler

  @SubscribeMessage('joined-room')
  public joinedRoom(user: User) {
    roomState.addUser(user)
  }

  @SubscribeMessage('left-room')
  public leftRoom(user: User) {
    roomState.removeUser(user)
  }

  public joinRoom(room_id: string) {
    const user = userState.user as User
    this.handler.emit('join-room', { room_id, user })
  }

  public leaveRoom() {
    const user = userState.user as User
    const room = roomState.room as Room
    this.handler.emit('leave-room', { room_id: room.id, user })
  }
}
