import { once, uniqueId } from 'lodash'
import { makeAutoObservable, runInAction } from 'mobx'
import React from 'react'

let loadingTask: () => any | undefined

class RootState {
    public ready: boolean = false

    public center_card = React.createRef<HTMLDivElement>()

    public queue: Record<string, boolean> = {}

    public get loading(): boolean {
        return Object.keys(this.queue).length > 0
    }

    private constructor() {
        loadingTask = this.queueTask().unqueueTask
        makeAutoObservable(this)
    }

    public setReadyState(ready: boolean) {
        this.ready = ready
        loadingTask?.()
    }

    public queueTask() {
        const task_id = uniqueId()
        this.queue[task_id] = true

        return {
            unqueueTask: () =>
                runInAction(() => {
                    delete this.queue[task_id]
                }),
        }
    }

    public static create() {
        return once(() => new RootState())()
    }
}

export const rootState = RootState.create()
