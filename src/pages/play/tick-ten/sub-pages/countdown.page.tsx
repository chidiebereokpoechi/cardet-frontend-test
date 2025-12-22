import { observer } from 'mobx-react'
import React from 'react'
import { Subscription } from 'rxjs'
import { MenuButton, MenuButtonList } from '../../../../components'
import { useTickTenGame } from '../../../../util'
import { useTickTenCountdown } from '../../../../util/misc/use-countdown'
import { RecordAnswerField } from '../components/record-answer-field'

let subscription: Subscription | undefined

export const CountdownPage = observer(() => {
    const { game } = useTickTenGame()
    const [countdown] = useTickTenCountdown()

    const submitAnswers = () => {
        subscription?.unsubscribe()
        subscription = game.submit()
    }

    return (
        <>
            <main className="">
                <div className="w-full grid gap-2">
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
            {!game.haveISubmitted && (
                <footer>
                    <div className="w-full">
                        <MenuButtonList>
                            <MenuButton
                                color="#d13e44"
                                onClick={submitAnswers}
                                innerText={countdown.toString()}
                                innerTextColor="white"
                            >
                                <span>Submit answers</span>
                            </MenuButton>
                        </MenuButtonList>
                    </div>
                </footer>
            )}
        </>
    )
})
