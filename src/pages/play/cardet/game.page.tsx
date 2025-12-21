import { AnimateSharedLayout } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import Confetti from 'react-confetti'
import { Menu, MessageCircle } from 'react-feather'
import { CircleButton, GamePageWrapper } from '../../../components'
import { roomState } from '../../../modules/rooms'
import { sound_manager, useCardetGame } from '../../../util'
import { app_history } from '../../../util/app-history'
import {
    CenterCards,
    MessagesPane,
    PlayerCards,
    PlayersArea,
    PlayMenu,
} from '../components'
import styled from 'styled-components'

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

export const CardetGamePage = observer(() => {
    const { manager, game } = useCardetGame()

    const openMessagesPane = React.useCallback(() => {
        return roomState.setMessagesPaneOpen(true)
    }, [])

    React.useEffect(() => {
        const unblock = app_history.block(
            'Are you sure you want to exit the current game',
        )

        return () => unblock()
    }, [])

    // React.useEffect(() => {
    //     if (!game.game_over) {
    //         sound_manager.startBackgroundMusic()
    //     }

    //     return () => sound_manager.stopBackgroundMusic()
    // }, [game.game_over])

    React.useEffect(() => {
        if (game.game_over) {
            sound_manager.startGameOver()
        }

        return () => sound_manager.stopGameOver()
    }, [game.game_over])

    return (
        <GamePageWrapper>
            {roomState.messages_pane_open && <MessagesPane />}
            {manager.menu_open && <PlayMenu />}
            {game.game_over && <Confetti />}
            <header className="justify-content-between align-items-center">
                <CircleButton onClick={openMessagesPane}>
                    {roomState.unreadMessages ? (
                        <Counter>
                            <span>{roomState.unreadMessages}</span>{' '}
                        </Counter>
                    ) : null}
                    <MessageCircle />
                </CircleButton>
                <CircleButton onClick={() => manager.openMenu()}>
                    <Menu />
                </CircleButton>
            </header>
            <main>
                <AnimateSharedLayout type="crossfade">
                    <PlayersArea />
                    <CenterCards />
                    <PlayerCards />
                </AnimateSharedLayout>
            </main>
        </GamePageWrapper>
    )
})
