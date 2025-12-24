import { SubscribeMessage, WsEventHandler, WsGateway } from '../../util/api'
import { gameManager } from '../game'
import { User } from '../user/user.entity'
import { userState } from '../user/user.state'
import { Message } from './message'
import { GameConfig, Room } from './types'
import { roomState } from './room'

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
    public gameStarted() {
        gameManager.gameStarted()
    }

    @SubscribeMessage('ended-game')
    public refreshGame() {
        gameManager.getGameState()
    }

    @SubscribeMessage('played')
    public played(user: User) {
        gameManager.getGameState()
    }

    @SubscribeMessage('submitted-answers')
    public submittedAnswers() {
        gameManager.getGameState()
    }

    @SubscribeMessage('updated-game-config')
    public updatedGameConfig(config: GameConfig) {
        roomState.setGameConfig(config)
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

    public submitAnswers(submittedAt: number) {
        const user = userState.user as User
        const room = roomState.room as Room
        this.handler.emit('submit-answers', {
            room_id: room.id,
            user,
            submittedAt,
        })
    }

    public updateGameConfig(config: GameConfig) {
        const room = roomState.room as Room
        this.handler.emit('update-game-confg', { roomId: room.id, config })
    }
}
