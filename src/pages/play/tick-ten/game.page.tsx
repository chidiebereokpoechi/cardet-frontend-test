import { AnimateSharedLayout } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import { Menu, MessageCircle } from 'react-feather'
import styled from 'styled-components'
import { CircleButton, GamePageWrapper } from '../../../components'
import { GameStatus } from '../../../modules/game/tick-ten'
import { roomState } from '../../../modules/rooms'
import { useTickTenGame } from '../../../util'
import { MessagesPane, PlayMenu } from '../components'
import { TurnPage } from './sub-pages'
import { GradingPage } from './sub-pages/grading.page'
import { LeaderboardPage } from './sub-pages/leaderboard.page'

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

export const TickTenGamePage = observer(() => {
    const { manager, game } = useTickTenGame()

    const openMessagesPane = React.useCallback(() => {
        return roomState.setMessagesPaneOpen(true)
    }, [])

    return (
        <GamePageWrapper>
            {roomState.messages_pane_open && <MessagesPane />}
            {manager.menu_open && <PlayMenu />}
            <header className="justify-content-between align-items-center">
                <CircleButton onClick={openMessagesPane}>
                    {roomState.unreadMessages ? (
                        <Counter>
                            <span>{roomState.unreadMessages}</span>{' '}
                        </Counter>
                    ) : null}
                    <MessageCircle />
                </CircleButton>
                <span>{game.turn.letter}</span>
                <CircleButton onClick={() => manager.openMenu()}>
                    <Menu />
                </CircleButton>
            </header>
            {game.status === GameStatus.TURN_STARTED && <TurnPage />}
            {game.status === GameStatus.COUNTDOWN && <TurnPage />}
            {game.status === GameStatus.GRADING && <GradingPage />}
            {game.status === GameStatus.LEADERBOARD && <LeaderboardPage />}
            {game.status === GameStatus.GAME_OVER && <LeaderboardPage />}
        </GamePageWrapper>
    )
})
