import { map } from 'lodash'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import {
    Circle,
    CornerUpRight,
    Menu,
    MessageCircle,
    MoreHorizontal,
    MoreVertical,
    Settings,
} from 'react-feather'
import styled from 'styled-components'
import {
    CircleButton,
    MenuButton,
    MenuButtonList,
    MenuPageWrapper,
    UserPin,
} from '../../../components'
import { gameManager, GameType } from '../../../modules/game'
import { Room, RoomState, roomState } from '../../../modules/rooms'
import { User } from '../../../modules/user/user.entity'
import { userState } from '../../../modules/user/user.state'
import { MessagesPane, PlayerList } from '../components'
import { SettingsPane } from './components'
import { GiCog } from 'react-icons/gi'

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
    const game = gameManager.cardetGame

    const leaveRoom = React.useCallback(() => {
        return roomState.leaveRoom()
    }, [])

    const startGame = React.useCallback((gameType: GameType) => {
        return gameManager.startGame(gameType)
    }, [])

    const openMessagesPane = React.useCallback(() => {
        return roomState.setMessagesPaneOpen(true)
    }, [])

    const shareRoomLink = async () => {
        const roomUrl = '/play/join-room?code=' + room.id

        if ('share' in navigator) {
            try {
                await (navigator as any).share({
                    title: 'Join My Room',
                    text: 'Click the link below to join my room!',
                    url: roomUrl,
                })
            } catch (error) {
                console.error('Error sharing room link:', error)
            }
        } else {
            // Fallback: Copy to clipboard if Web Share API is unavailable
            ;(navigator as any).clipboard.writeText(roomUrl)
            alert('Room link copied to clipboard!')
        }
    }

    useEffect(() => {
        gameManager.getGameState()
    }, [game])

    useEffect(() => {
        const sub = roomState.getUserRoom()
        return () => {
            sub?.unsubscribe()
        }
    }, [])

    const disableCardetGame =
        room.room_state !== RoomState.LOBBY ||
        room.members.length < 2 ||
        room.members.length > 4

    const disableTickTenGame =
        room.room_state !== RoomState.LOBBY || room.members.length < 2

    return (
        <MenuPageWrapper>
            {roomState.messages_pane_open && <MessagesPane />}
            {roomState.isSettingsPaneOpen && <SettingsPane />}
            <header>
                <div
                    className="w-100 align-items-center grid-cols-[48px 1fr 48px]"
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'var(--button-height) 1fr var(--button-height)',
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
                    <div className="flex justify-center">
                        <span>{room.id}</span>
                    </div>
                    <CircleButton
                        onClick={() => roomState.setIsSettingsPaneOpen(true)}
                    >
                        <Menu />
                    </CircleButton>
                </div>
            </header>
            <main className="flex-1 overflow-hidden">
                <div className="w-100 flex items-center flex-col h-full">
                    <span>Players in the room</span>
                    <PlayerList className="mt-3 w-full flex flex-1 overflow-y-auto">
                        {map(room.members, (_user) => (
                            <UserPin
                                name={_user.name}
                                you={user.id === _user.id}
                                isAdmin={room.creator.id === _user.id}
                                key={_user.id}
                            />
                        ))}
                    </PlayerList>
                </div>
            </main>
            <footer>
                <div className="w-100">
                    <MenuButtonList>
                        <MenuButton
                            color="var(--green)"
                            onClick={() => startGame(GameType.CARDET)}
                            disabled={disableCardetGame}
                        >
                            Play Cardet™
                        </MenuButton>
                        <MenuButton
                            color="var(--blue)"
                            onClick={() => startGame(GameType.TICK_TEN)}
                            disabled={disableTickTenGame}
                        >
                            Play Tick Ten™
                        </MenuButton>
                        {/* <MenuButton color="#d1a33e" onClick={shareRoomLink}>
                            Share link to join
                        </MenuButton> */}
                        <MenuButton color="var(--red)" onClick={leaveRoom}>
                            {room.members.length === 1
                                ? 'Close room'
                                : 'Leave room'}
                        </MenuButton>
                    </MenuButtonList>
                </div>
            </footer>
        </MenuPageWrapper>
    )
})
