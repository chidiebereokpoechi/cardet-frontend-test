import { map } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import {
  BackButton,
  Button,
  MenuButton,
  MenuButtonList,
  MenuLinkButton,
  MenuPageWrapper,
  UserPin,
} from '../../components'
import { roomState } from '../../modules/rooms'
import { User, userState } from '../../modules/user'

export const PlayOptionsPage = observer(() => {
  const user = userState.user as User
  const room = roomState.room

  const createRoom = React.useCallback(() => {
    return roomState.createRoom()
  }, [])

  const leaveRoom = React.useCallback(() => {
    return roomState.leaveRoom()
  }, [])

  return (
    <MenuPageWrapper>
      <header>
        <BackButton to="/" />
        <span>Play</span>
      </header>
      <main>
        <div>
          {!room && (
            <MenuButtonList>
              <MenuButton color="#4D8275" onClick={createRoom}>
                Create room
              </MenuButton>
              <MenuLinkButton color="#744D82" to="/play/join-room">
                Join room
              </MenuLinkButton>
            </MenuButtonList>
          )}
          {room && (
            <div>
              <h2>You are in room: {room.id}</h2>
              <Button onClick={() => leaveRoom()}>Leave room</Button>
              <hr />
              <div className="mt-3">
                {map(room.members, (_user) => (
                  <UserPin {..._user} key={_user.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <footer>
        <UserPin {...(user as User)} />
      </footer>
    </MenuPageWrapper>
  )
})
