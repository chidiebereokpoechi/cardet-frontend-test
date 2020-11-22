import { map } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { BackButton, Button, MenuPageWrapper, UserPin } from '../../components'
import { gameManagerState } from '../../modules/game'
import { Room, roomState } from '../../modules/rooms'
import { User, userState } from '../../modules/user'
import { PlayerList } from './components'

export const RoomPage = observer(() => {
  const user = userState.user as User
  const room = roomState.room as Room
  const game = gameManagerState.game

  const leaveRoom = React.useCallback(() => {
    return roomState.leaveRoom()
  }, [])

  const startGame = React.useCallback(() => {
    return gameManagerState.startGame()
  }, [])

  React.useEffect(() => {
    gameManagerState.getGameState()
  }, [game])

  return (
    <MenuPageWrapper>
      <header>
        <BackButton to="/" />
        <span>
          <code>{room.id}</code>
        </span>
      </header>
      <main>
        <div className="w-100">
          <h4>Currently in room</h4>
          <PlayerList className="my-4">
            {map(room.members, (_user) => (
              <UserPin
                name={_user.id === user.id ? 'You' : _user.name}
                key={_user.id}
              />
            ))}
          </PlayerList>
        </div>
      </main>
      <footer>
        <Button onClick={leaveRoom}>Leave</Button>
        <Button onClick={startGame}>Start</Button>
      </footer>
    </MenuPageWrapper>
  )
})
