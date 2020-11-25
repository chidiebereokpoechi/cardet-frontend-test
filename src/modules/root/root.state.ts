import { once, uniqueId } from 'lodash'
import { action, autorun, computed, observable } from 'mobx'
import React from 'react'

class RootState {
  @observable
  public ready: boolean = false

  @observable
  public center_card = React.createRef<HTMLDivElement>()

  @observable
  public queue: Record<string, boolean> = {}

  @computed
  public get loading(): boolean {
    return Object.keys(this.queue).length > 0
  }

  private constructor() {
    autorun(() => {
      // if (this.center_card.current) {
      //   const { left, right } = this.center_card.current.getBoundingClientRect()
      //   console.log({ left, right })
      // }
    })
  }

  @action
  public setReadyState(ready: boolean) {
    this.ready = ready
  }

  @action
  public queueTask() {
    const task_id = uniqueId()
    this.queue[task_id] = true

    return {
      unqueueTask: () => {
        delete this.queue[task_id]
      },
    }
  }

  public static create() {
    return once(() => new RootState())()
  }
}

export const rootState = RootState.create()
