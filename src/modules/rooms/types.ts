import { TickTenGameConfig } from '../game/tick-ten'
import { User } from '../user/user.entity'
import { Message } from './message'

export enum RoomState {
    LOBBY = 'LOBBY',
    PLAYING = 'PLAYING',
}

export interface Room {
    id: string
    members: User[]
    creator: User
    messages: Message[]
    room_state: RoomState
    game_manager_id: string
    game_config: GameConfig
}

export interface GameConfig {
    readonly tickTenGameConfig: TickTenGameConfig
    readonly cardetGameConfig: {}
}
