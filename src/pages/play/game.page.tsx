import { AnimateSharedLayout } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import Confetti from 'react-confetti'
import { Menu, MessageCircle } from 'react-feather'
import { CircleButton, GamePageWrapper } from '../../components'
import { roomState } from '../../modules/rooms'
import { sound_manager, useGame } from '../../util'
import { app_history } from '../../util/app-history'
import {
    CenterCards,
    MessagesPane,
    PlayerCards,
    PlayersArea,
    PlayMenu,
} from './components'

export const GamePage = observer(() => {
    const { manager, game } = useGame()

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
