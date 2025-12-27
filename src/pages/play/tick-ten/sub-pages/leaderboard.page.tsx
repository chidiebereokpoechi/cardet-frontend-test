import { map } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Subscription } from 'rxjs'
import { MenuButton, MenuButtonList } from '../../../../components'
import { GamePosition } from '../../../../modules/game/tick-ten'
import { roomState } from '../../../../modules/rooms'
import { classNames, useTickTenGame } from '../../../../util'
import { ArrowRight, Check } from 'react-feather'

let subscription: Subscription | undefined

export const LeaderboardPage = observer(() => {
    const { game, manager } = useTickTenGame()
    const isGameOver = game.isGameOver
    const isAdmin = roomState.amIAdmin
    const allPlayersReady = game.allPlayersReady
    const amIReady = game.amIReady
    const amILastToReadyUp = game.amILastToReadyUp

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

    const readyUp = () => {
        subscription?.unsubscribe()
        subscription = game.readyUp()
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
                    <div className="flex flex-wrap justify-center items-center mr-2 ml-4 -mt-2 mb-2">
                        {game.letters.map((letter) => {
                            const letterHasBeenPlayed =
                                game.lettersRevealed.includes(letter)

                            if (!letterHasBeenPlayed) {
                                return (
                                    <span
                                        key={letter}
                                        className="mr-1 mb-2 w-8 text-center text-[var(--understated-grey)]"
                                    >
                                        -
                                    </span>
                                )
                            }

                            return (
                                <div
                                    key={letter}
                                    className={classNames(
                                        'flex bg-[#121518] relative items-center justify-center w-8 h-8 rounded-xl transition-colors mr-1 mb-2',
                                    )}
                                    style={{
                                        color: 'var(--understated-grey)',
                                        borderColor: 'var(--understated-grey)',
                                    }}
                                >
                                    <span>{letter}</span>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid gap-2">
                        {map(playerScores, ({ name, id, score }, i) => {
                            const position = game.getPlayerPosition(score)
                            const inTop3 = position !== GamePosition.OTHER
                            const icon =
                                position === GamePosition.FIRST
                                    ? '🏆'
                                    : position === GamePosition.SECOND
                                    ? '🥈'
                                    : position === GamePosition.THIRD
                                    ? '🥉'
                                    : i + 1

                            const scoreColor =
                                position === GamePosition.FIRST
                                    ? 'var(--gold)'
                                    : position === GamePosition.SECOND
                                    ? 'var(--silver)'
                                    : position === GamePosition.THIRD
                                    ? 'var(--bronze)'
                                    : ''

                            const maxTurnScore = game.categories.length * 10
                            const turnScore = game.turnScores[id]
                            const turnScoreColor =
                                turnScore === maxTurnScore
                                    ? 'var(--green)'
                                    : 'var(--understated-grey)'

                            const turnScoreShouldShimmer =
                                turnScore === maxTurnScore

                            return (
                                <div
                                    className="flex justify-between bg-[#1a2a31] px-[1.75rem] py-3"
                                    key={id}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex justify-center w-6 mr-2">
                                            <span
                                                className={classNames(
                                                    'inline-block',
                                                    inTop3 && 'shine',
                                                )}
                                            >
                                                {icon}
                                            </span>
                                        </div>
                                        <span style={{ color: scoreColor }}>
                                            {name}
                                        </span>
                                        {game.turn.readyPlayers.find(
                                            (player) => player.id === id,
                                        ) && (
                                            <div className="ml-2 text-[var(--green)]">
                                                <Check size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <span
                                        className="inline-flex items-start"
                                        style={{ color: scoreColor }}
                                    >
                                        <span>{score}</span>
                                        <span
                                            className={classNames(
                                                'text-[.75rem] text-right inline-block w-6',
                                                turnScoreShouldShimmer &&
                                                    'shine',
                                            )}
                                            style={{
                                                color: turnScoreColor,
                                            }}
                                        >
                                            +{turnScore}
                                        </span>
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
                                onClick={readyUp}
                                disabled={amIReady}
                                icon={amILastToReadyUp ? ArrowRight : Check}
                            >
                                <span>
                                    {amILastToReadyUp
                                        ? `Start next turn`
                                        : `Ready up`}
                                </span>
                            </MenuButton>
                        )}
                    </MenuButtonList>
                </div>
            </footer>
        </>
    )
})
