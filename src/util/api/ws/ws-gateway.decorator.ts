import { forEach } from 'lodash'
import { userState } from '../../../modules/user/user.state'
import { ApiUtil } from '../api-util'
import {
    subscriptionsMetaKey,
    WsEventSubscription,
} from './subscribe-message.decorator'
import { WsEventHandler } from './ws-event-handler'

export const WsGateway = <
    T extends new (...args: any[]) => { handler: WsEventHandler } & any,
>(
    namespace: string,
) => {
    return (target: T) => {
        return class extends target {
            private handler: WsEventHandler

            constructor(...args: any[]) {
                super()
                console.info(
                    `New websocket handler being created for '${namespace}'`,
                )
                const handler = new WsEventHandler(
                    ApiUtil.getUrl(namespace),
                    userState.user!.id,
                )
                this.handler = handler

                const keys: WsEventSubscription[] = Reflect.getOwnMetadata(
                    subscriptionsMetaKey,
                    target,
                )

                forEach(keys, ({ event, handlerProperty }) => {
                    this.handler.on(event, this[handlerProperty].bind(this))
                })
            }
        }
    }
}
