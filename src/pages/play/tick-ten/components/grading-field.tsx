import { useFormikContext } from 'formik'
import { observer } from 'mobx-react'
import React from 'react'
import { Check, Copy, X } from 'react-feather'
import { Subscription } from 'rxjs'
import { Answer, Category, Verdict } from '../../../../modules/game/tick-ten'
import { GradeSubmissionModel } from '../../../../modules/game/tick-ten/models'
import { classNames, useTickTenGame } from '../../../../util'

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
            className={classNames(
                'flex items-center justify-center font-light w-8 h-8 rounded-xl',
                verdict === formik.values.verdicts[category]
                    ? `bg-[${color}]`
                    : 'bg-[#222628]',
            )}
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

        const otherAnswers = game.submissionToGrade.others.map(
            (o) => o.answers[category],
        )

        return (
            <div className="grid grid-cols-1 gap-2 bg-[#121518] px-[1.75rem] py-3">
                <div className="flex flex-row justify-between">
                    <div>
                        <span className="text-[.5rem] text-[#97979b] block">
                            {category}
                        </span>
                        <span className="flex font-bold">{answer.word}</span>
                    </div>
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
                            color="var(--yellow)"
                            icon={Copy}
                        />
                        <VerdictButton
                            verdict="incorrect"
                            category={category}
                            color="var(--red)"
                            icon={X}
                        />
                    </div>
                </div>
                <div className="-mb-1">
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
                </div>
            </div>
        )
    },
)
