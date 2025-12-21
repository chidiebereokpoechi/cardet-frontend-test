import { AnimateSharedLayout } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import Confetti from 'react-confetti'
import { Menu, MessageCircle } from 'react-feather'
import { CircleButton, GamePageWrapper } from '../../../components'
import { roomState } from '../../../modules/rooms'
import { sound_manager, useCardetGame, useTickTenGame } from '../../../util'
import { app_history } from '../../../util/app-history'
import {
    CenterCards,
    MessagesPane,
    PlayerCards,
    PlayersArea,
    PlayMenu,
} from '../components'
import styled from 'styled-components'
import { GameStatus } from '../../../modules/game/tick-ten'
import { RecordAnswerField } from './components/record-answer-field'

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

export const Turn = observer(() => {
    const { manager, game } = useTickTenGame()

    return (
        <div className="w-100 display-flex">
            <h1>{game.turn.letter}</h1>
            <div></div>
            {game.categories.map((category) => (
                <RecordAnswerField
                    key={category}
                    category={category}
                    answer={
                        game.playerSheet.submissions[game.turn.letter].answers[
                            category
                        ].word
                    }
                    recordAnswer={game.recordAnswer.bind(game)}
                />
            ))}
        </div>
    )
})

export const TickTenGamePage = observer(() => {
    const { manager, game } = useTickTenGame()

    const openMessagesPane = React.useCallback(() => {
        return roomState.setMessagesPaneOpen(true)
    }, [])

    React.useEffect(() => {
        const unblock = app_history.block(
            'Are you sure you want to exit the current game',
        )

        return () => unblock()
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
                <CircleButton onClick={() => manager.openMenu()}>
                    <Menu />
                </CircleButton>
            </header>
            <main>
                <AnimateSharedLayout type="crossfade">
                    {game.status === GameStatus.TURN_STARTED && <Turn />}
                </AnimateSharedLayout>
            </main>
        </GamePageWrapper>
    )
})
