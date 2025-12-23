import { observer } from 'mobx-react'
import React from 'react'
import { Subscription } from 'rxjs'
import { MenuButton, MenuButtonList } from '../../../../components'
import { useTickTenCountdown, useTickTenGame } from '../../../../util'
import { RecordAnswerField } from '../components/record-answer-field'
import { GameStatus } from '../../../../modules/game/tick-ten'

export const TurnPage = observer(() => {
    let subscription: Subscription | undefined

    const { game } = useTickTenGame()
    const [countdown] = useTickTenCountdown()
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
            <main className="">
                <div className="w-full grid gap-3">
                    {game.categories.map((category) => {
                        const letter = game.turn.letter
                        const submission = game.playerSheet.submissions[letter]
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
            </main>
            <footer>
                <div className="w-full">
                    <MenuButtonList>
                        <MenuButton
                            color="var(--green)"
                            onClick={submitAnswers}
                            innerText={
                                isCountingDown
                                    ? countdown.toString()
                                    : undefined
                            }
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
