import { observer } from 'mobx-react'
import React from 'react'
import { userState } from './modules/user/user.state'

export const App: React.FC = observer(() => {
  const { user } = userState
  return user ? <div>The user is loaded</div> : null
})
