import { observer } from 'mobx-react'
import React from 'react'
import { Subscription } from 'rxjs'
import { MenuButton, MenuButtonList } from '../../../../components'
import { useTickTenGame } from '../../../../util'
import { RecordAnswerField } from '../components/record-answer-field'

export const TurnPage = observer(() => {
    let subscription: Subscription | undefined

    const { game } = useTickTenGame()

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
                            disabled={hasWrittenAllAnswers() === false}
                        >
                            <span>Submit answers</span>
                        </MenuButton>
                    </MenuButtonList>
                </div>
            </footer>
        </>
    )
})
