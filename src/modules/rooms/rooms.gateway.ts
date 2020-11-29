import { SubscribeMessage, WsEventHandler, WsGateway } from '../../util/api'
import { gameManagerState } from '../game'
import { User, userState } from '../user'
import { Message } from './message'
import { Room } from './room.entity'
import { roomState } from './room.state'

@WsGateway('rooms')
export class RoomsGateway {
  public readonly handler!: WsEventHandler

  @SubscribeMessage('joined-room')
  public joinedRoom(user: User) {
    roomState.addUser(user)
  }

  @SubscribeMessage('created-message')
  public createdMessage(message: Message) {
    roomState.addMessage(message)
  }

  @SubscribeMessage('left-room')
  public leftRoom(user: User) {
    roomState.removeUser(user)
  }

  @SubscribeMessage('started-game')
  @SubscribeMessage('ended-game')
  public refreshGame() {
    gameManagerState.getGameState()
  }

  @SubscribeMessage('played')
  public played(user: User) {
    gameManagerState.getGameState()
  }

  public joinRoom(room_id: string) {
    const user = userState.user as User
    this.handler.emit('join-room', { room_id, user })
  }

  public createMessage(message: string) {
    const user = userState.user as User
    const room = roomState.room as Room
    this.handler.emit('create-message', { room_id: room.id, user, message })
  }

  public leaveRoom() {
    const user = userState.user as User
    const room = roomState.room as Room
    this.handler.emit('leave-room', { room_id: room.id, user })
  }

  public startGame() {
    const user = userState.user as User
    const room = roomState.room as Room
    this.handler.emit('start-game', { room_id: room.id, user })
  }

  public endGame() {
    const user = userState.user as User
    const room = roomState.room as Room
    this.handler.emit('end-game', { room_id: room.id, user })
  }

  public play() {
    const user = userState.user as User
    const room = roomState.room as Room
    this.handler.emit('play', { room_id: room.id, user })
  }
}
