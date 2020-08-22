import React from 'react'
import { userState } from '../../modules/user/user.state'

export const MainMenuPage = () => {
  const { user } = userState
  return <div>Welcome, {user?.name}</div>
}
