export const subscriptionsMetaKey = Symbol('subscription')

export interface WsEventSubscription {
  event: string
  handlerProperty: string
}

export const SubscribeMessage = (event: string) => {
  return (target: Object, property: string, descriptor: PropertyDescriptor) => {
    const subscriptions: WsEventSubscription[] =
      Reflect.getOwnMetadata(subscriptionsMetaKey, target.constructor) ?? []

    Reflect.defineMetadata(
      subscriptionsMetaKey,
      subscriptions.concat({ event, handlerProperty: property }),
      target.constructor
    )
  }
}
