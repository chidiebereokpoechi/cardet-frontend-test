import { map } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Subscription } from 'rxjs'
import { MenuButton, MenuButtonList } from '../../../../components'
import { classNames, useTickTenGame } from '../../../../util'

let subscription: Subscription | undefined

export const LeaderboardPage = observer(() => {
    const { game, manager } = useTickTenGame()
    const isGameOver = game.isGameOver

    const playerScores = game.players
        .map((player) => ({
            ...player,
            score: game.leaderboard[player.id] || 0,
        }))
        .sort((a, b) => b.score - a.score)

    const startNextTurn = () => {
        subscription?.unsubscribe()
        subscription = game.startNextTurn()
    }

    const goBackToLobby = () => {
        subscription?.unsubscribe()
        subscription = manager.endGame()
    }

    return (
        <>
            <main className="flex-1 overflow-x-hidden overflow-y-auto mb-4">
                <div className="m-[-1.75rem] w-[calc(100%+3.5rem)] flex flex-col">
                    <div className="flex justify-center">
                        <span className="text-xs p-4">
                            <span className="text-[var(--primary)]">
                                Leaderboard
                            </span>
                        </span>
                    </div>
                    <div className="grid gap-2">
                        {map(playerScores, ({ name, id, score }, i) => {
                            const position =
                                i === 0
                                    ? '🏆'
                                    : i === 1
                                    ? '🥈'
                                    : i === 2
                                    ? '🥉'
                                    : i + 1

                            const scoreColor =
                                i === 0
                                    ? 'var(--gold)'
                                    : i === 1
                                    ? 'var(--silver)'
                                    : i === 2
                                    ? 'var(--bronze)'
                                    : ''

                            return (
                                <div
                                    className="flex justify-between bg-[#1a2a31] px-[1.75rem] py-3"
                                    key={id}
                                >
                                    <div className="flex justify-between">
                                        <div className="flex justify-center w-6 mr-2">
                                            <span className="inline-block">
                                                {position}
                                            </span>
                                        </div>
                                        <span>{name}</span>
                                    </div>
                                    <span style={{ color: scoreColor }}>
                                        {score}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </main>
            <footer>
                <div className="w-full">
                    <MenuButtonList>
                        {isGameOver ? (
                            <MenuButton
                                color="var(--blue)"
                                onClick={goBackToLobby}
                            >
                                <span>Go back to lobby</span>
                            </MenuButton>
                        ) : (
                            <MenuButton
                                color="var(--green)"
                                onClick={startNextTurn}
                            >
                                <span>Start next round</span>
                            </MenuButton>
                        )}
                    </MenuButtonList>
                </div>
            </footer>
        </>
    )
})
