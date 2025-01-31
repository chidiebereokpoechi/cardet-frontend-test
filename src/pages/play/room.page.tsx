import { map } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { MessageCircle } from 'react-feather'
import styled from 'styled-components'
import {
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

const Counter = styled.div`
    position: absolute;
    width: 1.5rem;
    height: 1.5rem;
    font-size: 0.5rem;
    font-weight: bold;
    background: #1fbf5f;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.35), 0 0 0 8px rgba(0, 0, 0, 0.05) inset,
        0 0 0 6px rgba(255, 255, 255, 0.1) inset,
        0 0 0 3px rgba(255, 255, 255, 0.45) inset;
    color: white;
    top: -0.75rem;
    right: -0.75rem;
    border-radius: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
`

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
                        {roomState.unreadMessages ? (
                            <Counter>
                                <span>{roomState.unreadMessages}</span>{' '}
                            </Counter>
                        ) : null}
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
