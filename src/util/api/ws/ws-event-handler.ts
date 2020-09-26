import io from 'socket.io-client'
import { userState } from '../../../modules/user'

export class WsEventHandler {
  private readonly _socket: SocketIOClient.Socket

  constructor(url: string) {
    this._socket = io(url, {
      query: { user_id: userState.user?.id },
      transports: ['websocket', 'polling'],
    })
  }

  public emit<D = never, R = never>(
    event: string,
    data?: D,
    handler?: (data: R) => any,
  ) {
    if (handler) {
      this._socket.emit(event, data, handler)
      return
    }

    this._socket.emit(event, data)
  }

  public on<R = undefined>(event: string, handler: (data: R) => any) {
    this._socket.on(event, handler)
  }

  public disconnect() {
    this._socket.close()
  }
}
