import { useFormikContext } from 'formik'
import { trim } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Check, Copy, Minus, X } from 'react-feather'
import { Subscription } from 'rxjs'
import { Answer, Category, Verdict } from '../../../../modules/game/tick-ten'
import { GradeSubmissionModel } from '../../../../modules/game/tick-ten/models'
import { classNames, useTickTenGame } from '../../../../util'
import { MatchConfidence } from '../../../../util/misc/string-operations'

interface Props {
    category: Category
    answer: Answer
    values: GradeSubmissionModel
    children?: React.ReactNode
}

const VerdictButton: React.FC<{
    verdict: Verdict
    category: Category
    color: string
    icon: React.ComponentType<any>
    disabled?: boolean
}> = ({ verdict, color, icon: Icon, category, disabled }) => {
    const formik = useFormikContext<GradeSubmissionModel>()
    const isSelected = formik.values.verdicts[category] === verdict

    const onClick = () => {
        formik.setFieldValue(`verdicts.${category}`, verdict)
    }

    return (
        <button
            type="button"
            disabled={disabled}
            className="flex bg-[#132026] items-center justify-center font-light w-10 h-10 rounded-xl border-2 hover:border-white transition-colors"
            style={
                disabled
                    ? {
                          color: '#1e3037',
                          borderColor: '#1e3037',
                          cursor: 'not-allowed',
                      }
                    : {
                          color: isSelected ? color : '',
                          borderColor: isSelected ? color : '#132026',
                      }
            }
            onClick={onClick}
        >
            <Icon size={16} />
        </button>
    )
}

export const GradingField: React.FC<Props> = observer(
    ({ category, answer, values }) => {
        const { game } = useTickTenGame()
        const isEmptyAnswer = trim(answer.word).length === 0

        if (!game.submissionToGrade) {
            return null
        }

        const otherAnswers = game.submissionToGrade.others
            .map((o) => o.answers[category])
            .filter(({ word }) => trim(word).length > 0)

        const verdict = values.verdicts[category]
        const score =
            verdict === 'correct' ? '+10' : verdict === 'duplicate' ? '+5' : '0'

        const isExactDuplicate = answer.confidence === MatchConfidence.EXACT
        const isCloseDuplicate =
            answer.confidence === MatchConfidence.HIGH ||
            answer.confidence === MatchConfidence.MEDIUM

        return (
            <div className="grid grid-cols-1 gap-2 bg-[#1a2a31] px-[1.75rem] py-3">
                <div className="flex flex-row justify-between relative">
                    <div>
                        <span className="text-[.5rem] text-[var(--understated-grey)] block mb-1">
                            {category}
                        </span>
                        {answer.word ? (
                            <span className="flex font-bold">
                                {answer.word}
                            </span>
                        ) : (
                            <></>
                        )}
                    </div>
                    {game.haveIGraded && (
                        <div className="absolute right-0 top-0 flex items-center gap-2">
                            <span
                                className={classNames(
                                    'inline-block font-bold text-[1.5rem]',
                                    verdict === 'correct'
                                        ? 'text-[var(--green)]'
                                        : verdict === 'duplicate'
                                        ? 'text-[var(--blue)]'
                                        : 'text-[var(--red)]',
                                )}
                            >
                                {score}
                            </span>
                        </div>
                    )}
                    {!game.haveIGraded && (
                        <div className="grid grid-cols-3 gap-1 items-end">
                            <VerdictButton
                                verdict="correct"
                                category={category}
                                color="var(--green)"
                                icon={Check}
                                disabled={isExactDuplicate || isEmptyAnswer}
                            />
                            <VerdictButton
                                verdict="duplicate"
                                category={category}
                                color="var(--blue)"
                                icon={Copy}
                                disabled={isEmptyAnswer}
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
                        <details
                            className="text-[.65rem]"
                            open={isExactDuplicate || isCloseDuplicate}
                        >
                            <summary className="text-[#97979b]">
                                Other answers
                            </summary>
                            <div className="mt-3">
                                {otherAnswers.map((a, i) => (
                                    <span
                                        key={i}
                                        className={classNames(
                                            'text-[.75rem] border-[2px] border-white mr-1 mb-0.5 inline-flex py-1 px-2 rounded-[10px]',
                                            isCloseDuplicate &&
                                                '!border-[#3e8cd1] !text-[#3e8cd1]',
                                            isExactDuplicate &&
                                                '!border-[#3e8cd1] !bg-[#3e8cd1] !text-white',
                                        )}
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
