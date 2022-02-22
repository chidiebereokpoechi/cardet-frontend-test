import { map } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { MessageCircle, X } from 'react-feather'
import {
    Button,
    CircleButton,
    MenuButton,
    MenuButtonList,
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
            <header>
                <div
                    className="w-100 align-items-center"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'var(--button-height) 1fr',
                        gap: '2rem',
                    }}
                >
                    <CircleButton onClick={openMessagesPane}>
                        <MessageCircle />
                    </CircleButton>
                    <span>{room.id}</span>
                </div>
            </header>
            <main>
                <div className="w-100">
                    <span>Players in the room</span>
                    <PlayerList className="mt-3">
                        {map(room.members, (_user) => (
                            <UserPin
                                name={_user.name}
                                you={user.id === _user.id}
                                key={_user.id}
                            />
                        ))}
                    </PlayerList>
                </div>
            </main>
            <footer>
                <div className="w-100">
                    <MenuButtonList>
                        {room.members.length > 1 && room.members.length < 4 && (
                            <MenuButton color="#4D8275" onClick={startGame}>
                                Start game
                            </MenuButton>
                        )}
                        <MenuButton color="#c7243f" onClick={leaveRoom}>
                            Leave room
                        </MenuButton>
                    </MenuButtonList>
                </div>
            </footer>
        </MenuPageWrapper>
    )
})
