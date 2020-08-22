import { observer } from 'mobx-react'
import React from 'react'
import { GameCanvas, GameRouter, Loader, Stylesheet } from './components'
import { userState } from './modules/user/user.state'

export const App: React.FC = observer(() => {
  const { user } = userState
  return (
    <React.Fragment>
      <Stylesheet />
      <GameCanvas>{user ? <GameRouter /> : <Loader />}</GameCanvas>
    </React.Fragment>
  )
})
