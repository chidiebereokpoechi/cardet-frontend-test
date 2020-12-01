import { once, uniqueId } from 'lodash'
import { action, computed, observable } from 'mobx'
import React from 'react'

let loadingTask: () => any | undefined

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
    loadingTask = this.queueTask().unqueueTask
  }

  @action
  public setReadyState(ready: boolean) {
    this.ready = ready
    loadingTask?.()
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
