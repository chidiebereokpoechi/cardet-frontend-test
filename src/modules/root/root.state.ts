import { once } from 'lodash'
import { action, autorun, observable } from 'mobx'
import React from 'react'

class RootState {
  @observable
  public ready: boolean = false

  @observable
  public center_card = React.createRef<HTMLDivElement>()

  private constructor() {
    autorun(() => {
      if (this.center_card.current) {
        const { left, right } = this.center_card.current.getBoundingClientRect()
        console.log({ left, right })
      }
    })
  }

  @action
  public setReadyState(ready: boolean) {
    this.ready = ready
  }

  public static create() {
    return once(() => new RootState())()
  }
}

export const rootState = RootState.create()
