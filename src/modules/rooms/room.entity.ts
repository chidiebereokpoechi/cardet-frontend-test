import { User } from '../user/user.entity'
import { Message } from './message'

export enum RoomState {
    LOBBY,
    PLAYING,
}

export interface Room {
    id: string
    members: User[]
    creator: User
    messages: Message[]
    room_state: RoomState
    game_manager_id: string
}
