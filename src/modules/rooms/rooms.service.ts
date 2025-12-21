import { HttpClient } from '../../util/api'
import { GameState } from '../game/game-state'
import { Room } from './room.entity'

class RoomsService {
    public getCurrentRoom() {
        return HttpClient.get<Room>('rooms', false)
    }

    public createRoom() {
        return HttpClient.post<never, Room>('rooms', undefined, false)
    }

    public joinRoom(room_id: string) {
        return HttpClient.post<never, Room>(
            `rooms/${room_id}`,
            undefined,
            false,
        )
    }

    public changeGameConfig(room_id: string, gameConfig: object) {
        return HttpClient.patch<object, Room>(
            `rooms/${room_id}`,
            gameConfig,
            false,
        )
    }

    public getGameState() {
        return HttpClient.get<GameState>(`rooms/state`)
    }

    public startGame(gameType: string) {
        return HttpClient.post<{ gameType: string }, unknown>(
            `rooms/start-game`,
            { gameType },
            false,
        )
    }

    public endGame() {
        return HttpClient.post<never, Room>(`rooms/end-game`, undefined, false)
    }

    public leaveRoom() {
        return HttpClient.delete('rooms', false)
    }
}

export const roomsService = new RoomsService()
