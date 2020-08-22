import { observer } from 'mobx-react'
import React from 'react'
import { GameCanvas, GameRouter, Loader, Stylesheet } from './components'
import { rootState } from './modules/root'

export const App: React.FC = observer(() => {
  const ready = rootState.ready

  return (
    <React.Fragment>
      <Stylesheet />
      <GameCanvas>{ready ? <GameRouter /> : <Loader />}</GameCanvas>
    </React.Fragment>
  )
})
