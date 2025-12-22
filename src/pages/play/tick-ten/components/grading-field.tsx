import { useFormikContext } from 'formik'
import { observer } from 'mobx-react'
import React from 'react'
import { Check, Copy, X } from 'react-feather'
import { Subscription } from 'rxjs'
import { Answer, Category, Verdict } from '../../../../modules/game/tick-ten'
import { GradeSubmissionModel } from '../../../../modules/game/tick-ten/models'
import { classNames, useTickTenGame } from '../../../../util'
import { CircleButton } from '../../../../components'
import { trim } from 'lodash'

interface Props {
    category: Category
    answer: Answer
    values: GradeSubmissionModel
}

let subscription: Subscription | undefined

const VerdictButton: React.FC<{
    verdict: Verdict
    category: Category
    color: string
    icon: React.ComponentType<any>
}> = ({ verdict, color, icon: Icon, category }) => {
    const formik = useFormikContext<GradeSubmissionModel>()

    const onClick = () => {
        formik.setFieldValue(`verdicts.${category}`, verdict)
    }

    return (
        <button
            type="button"
            className="flex items-center justify-center font-light w-8 h-8 rounded-xl"
            style={{
                backgroundColor:
                    verdict === formik.values.verdicts[category]
                        ? color
                        : '#222628',
            }}
            onClick={onClick}
        >
            <Icon size={18} />
        </button>
    )
}

export const GradingField: React.FC<Props> = observer(
    ({ category, answer }) => {
        const { game } = useTickTenGame()

        if (!game.submissionToGrade) {
            return null
        }

        const otherAnswers = game.submissionToGrade.others
            .map((o) => o.answers[category])
            .filter(({ word }) => trim(word).length > 0)

        const score = (() => {
            switch (answer.verdict) {
                case 'correct':
                    return 10
                case 'duplicate':
                    return 5
                case 'incorrect':
                    return 0
                default:
                    return 0
            }
        })()

        return (
            <div className="grid grid-cols-1 gap-2 bg-[#121518] px-[1.75rem] py-3">
                <div className="flex flex-row justify-between">
                    <div>
                        <span className="text-[.5rem] text-[var(--understated-grey)] block">
                            {category}
                        </span>
                        <span className="flex font-bold">{answer.word}</span>
                    </div>
                    {game.haveIGraded && (
                        <div>
                            <>
                                <span>{score}</span>
                            </>
                        </div>
                    )}
                    {!game.haveIGraded && (
                        <div className="grid grid-cols-3 gap-2">
                            <VerdictButton
                                verdict="correct"
                                category={category}
                                color="var(--green)"
                                icon={Check}
                            />
                            <VerdictButton
                                verdict="duplicate"
                                category={category}
                                color="var(--blue)"
                                icon={Copy}
                            />
                            <VerdictButton
                                verdict="incorrect"
                                category={category}
                                color="var(--red)"
                                icon={X}
                            />
                        </div>
                    )}
                </div>
                <div className="-mb-1">
                    {otherAnswers.length ? (
                        <details className="text-[.65rem]">
                            <summary className="text-[#97979b]">
                                Other answers
                            </summary>
                            <div className="mt-3">
                                {otherAnswers.map((a, i) => (
                                    <span
                                        key={i}
                                        className="text-[.5rem] mr-1 mb-0.5 inline-flex py-0.5 px-1.5 bg-slate-100 text-black rounded-md"
                                    >
                                        {a.word}
                                    </span>
                                ))}
                            </div>
                        </details>
                    ) : null}
                </div>
            </div>
        )
    },
)
