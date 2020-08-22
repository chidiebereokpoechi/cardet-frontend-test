import io from 'socket.io-client'
import { userState } from '../../../modules/user/user.state'
import { WsApiResponse } from '../api-response'

export class WsEventHandler {
  private readonly _socket: SocketIOClient.Socket

  constructor(url: string) {
    this._socket = io(url, {
      query: { user_id: userState.user?.id },
      transports: ['websocket'],
    })
  }

  public emit<D = never, R = never>(
    event: string,
    data?: D,
    handler?: (data: WsApiResponse<R>) => any
  ) {
    if (handler) {
      this._socket.emit(event, data, handler)
      return
    }

    this._socket.emit(event, data)
  }

  public on<R = undefined>(
    event: string,
    handler: (data: WsApiResponse<R>) => any
  ) {
    this._socket.on(event, handler)
  }

  public disconnect() {
    this._socket.close()
  }
}
