import { HttpClient } from '../../util/api'
import { Room } from './room.entity'

class RoomsService {
  public getCurrentRoom() {
    return HttpClient.get<Room>('rooms')
  }

  public createRoom() {
    return HttpClient.post<never, Room>('rooms')
  }

  public joinRoom(room_id: string) {
    return HttpClient.post<never, Room>(`rooms/${room_id}`)
  }

  public leaveRoom() {
    return HttpClient.delete('rooms')
  }
}

export const roomsService = new RoomsService()
