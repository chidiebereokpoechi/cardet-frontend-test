import { forEach } from 'lodash'
import { ApiUtil } from '../api-util'
import {
  subscriptionsMetaKey,
  WsEventSubscription,
} from './subscribe-message.decorator'
import { WsEventHandler } from './ws-event-handler'

export const WsGateway = <
  T extends new (...args: any[]) => { handler: WsEventHandler } & any
>(
  namespace: string
) => {
  return (target: T) => {
    return class extends target {
      private handler: WsEventHandler

      constructor(...args: any[]) {
        super()
        const handler = new WsEventHandler(ApiUtil.getUrl(namespace))
        this.handler = handler

        const keys: WsEventSubscription[] = Reflect.getOwnMetadata(
          subscriptionsMetaKey,
          target
        )

        forEach(keys, ({ event, handlerProperty }) => {
          this.handler.on(event, this[handlerProperty].bind(this))
        })
      }
    }
  }
}
