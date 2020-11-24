import { HttpClient } from '../../util/api'
import { Room } from './room.entity'

class RoomsService {
  public getCurrentRoom() {
    return HttpClient.get<Room>('rooms', false)
  }

  public createRoom() {
    return HttpClient.post<never, Room>('rooms', undefined, false)
  }

  public joinRoom(room_id: string) {
    return HttpClient.post<never, Room>(`rooms/${room_id}`, undefined, false)
  }

  public leaveRoom() {
    return HttpClient.delete('rooms', false)
  }
}

export const roomsService = new RoomsService()
