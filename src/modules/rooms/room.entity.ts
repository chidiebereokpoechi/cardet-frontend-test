import { User } from '../user'

export enum RoomState {
  LOBBY,
  PLAYING,
}

export interface Room {
  id: string
  members: User[]
  creator: User
  room_state: RoomState
  game_manager_id: string
}
