import { map } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { MessageCircle, X } from 'react-feather'
import {
    Button,
    CircleButton,
    MenuPageWrapper,
    UserPin,
} from '../../components'
import { gameManagerState } from '../../modules/game'
import { Room, roomState } from '../../modules/rooms'
import { User } from '../../modules/user/user.entity'
import { userState } from '../../modules/user/user.state'
import { MessagesPane, PlayerList } from './components'

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

    const openMessagesPane = React.useCallback(() => {
        return roomState.setMessagesPaneOpen(true)
    }, [])

    React.useEffect(() => {
        gameManagerState.getGameState()
    }, [game])

    return (
        <MenuPageWrapper>
            {roomState.messages_pane_open && <MessagesPane />}
            <header className="justify-content-between align-items-center">
                <CircleButton onClick={openMessagesPane}>
                    <MessageCircle />
                </CircleButton>
                <CircleButton onClick={leaveRoom}>
                    <X />
                </CircleButton>
            </header>
            <main>
                <div className="w-100">
                    <h1>Code: {room.id}</h1>
                    <h6 style={{ color: '#c3c3c3' }}>Players in the room</h6>
                    <PlayerList className="my-4">
                        {map(room.members, (_user) => (
                            <UserPin
                                name={
                                    _user.name +
                                    (_user.id === user.id ? ' (you)' : '')
                                }
                                key={_user.id}
                            />
                        ))}
                    </PlayerList>
                </div>
            </main>
            <footer>
                <Button onClick={leaveRoom}>Leave</Button>
                {room.members.length > 1 && room.members.length < 4 && (
                    <Button onClick={startGame}>Start</Button>
                )}
            </footer>
        </MenuPageWrapper>
    )
})
