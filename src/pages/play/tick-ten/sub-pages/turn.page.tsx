import { motion } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import { Clock } from 'react-feather'
import { Subscription } from 'rxjs'
import { MenuButton, MenuButtonList } from '../../../../components'
import { GameStatus } from '../../../../modules/game/tick-ten'
import { roomState } from '../../../../modules/rooms'
import {
    classNames,
    useTickTenCountdown,
    useTickTenGame,
} from '../../../../util'
import { RecordAnswerField } from '../components/record-answer-field'

const Counter = observer(() => {
    const [countdown] = useTickTenCountdown()

    return (
        <motion.div
            className={classNames(
                'flex bg-[var(--red)] text-white rounded-2xl text-[1.25rem] w-[4rem] h-[4rem] justify-center items-center',
            )}
            animate={{
                rotate: [0, -18, 18, -14, 14, -8, 8, 0],
                x: [0, -6, 6, -5, 5, -3, 3, 0],
            }}
            transition={{
                duration: 0.25, // violent burst
                repeat: Infinity,
                repeatDelay: 0.75, // long pause (1s total cycle)
                ease: 'easeInOut',
            }}
        >
            <span>{countdown}</span>
        </motion.div>
    )
})

export const TurnPage = observer(() => {
    let subscription: Subscription | undefined

    const { game } = useTickTenGame()
    const isCountingDown = game.status === GameStatus.COUNTDOWN
    const haveISubmitted = game.haveISubmitted

    const hasWrittenAllAnswers = () => {
        const letter = game.turn.letter
        const submission = game.playerSheet.submissions[letter]

        return game.categories.every(
            (category) => submission.answers[category].word.length > 0,
        )
    }

    const submitAnswers = () => {
        subscription?.unsubscribe()
        subscription = game.submit()
    }

    return (
        <>
            <main className="flex-1 overflow-x-hidden overflow-y-auto mb-4">
                <div className="grid grid-cols-1 gap-2 w-full">
                    <div className="flex justify-center items-center">
                        {isCountingDown ? (
                            <Counter />
                        ) : (
                            <div className="flex bg-[#121518] text-[var(--understated-grey)] rounded-2xl text-[1.25rem] w-[4rem] h-[4rem] justify-center items-center">
                                <span>
                                    <Clock />
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="w-full grid gap-3">
                        {game.categories.map((category) => {
                            const letter = game.turn.letter
                            const submission =
                                game.playerSheet.submissions[letter]

                            const answer = submission.answers[category].word

                            return (
                                <RecordAnswerField
                                    key={category}
                                    category={category}
                                    answer={answer}
                                    recordAnswer={game.recordAnswer.bind(game)}
                                    disabled={game.haveISubmitted}
                                />
                            )
                        })}
                    </div>
                </div>
            </main>
            <footer>
                <div className="w-full">
                    <MenuButtonList>
                        <MenuButton
                            color="var(--green)"
                            onClick={submitAnswers}
                            disabled={
                                haveISubmitted ||
                                hasWrittenAllAnswers() === false
                            }
                        >
                            <span>Submit answers</span>
                        </MenuButton>
                    </MenuButtonList>
                </div>
            </footer>
        </>
    )
})
