import { once } from 'lodash'
import { action, observable } from 'mobx'

class RootState {
  @observable
  public ready: boolean = false

  private constructor() {}

  @action
  public setReadyState(ready: boolean) {
    this.ready = ready
  }

  public static create() {
    return once(() => new RootState())()
  }
}

export const rootState = RootState.create()
