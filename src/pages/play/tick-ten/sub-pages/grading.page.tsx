import { Formik } from 'formik'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { Subscription } from 'rxjs'
import {
    LoaderOverlay,
    MenuButton,
    MenuButtonList,
} from '../../../../components'
import { Category } from '../../../../modules/game/tick-ten'
import { GradeSubmissionModel } from '../../../../modules/game/tick-ten/models'
import { useTickTenGame } from '../../../../util'
import { GradingField } from '../components/grading-field'

let subscription: Subscription | undefined

export const GradingPage = observer(() => {
    const { game } = useTickTenGame()

    const haveIGraded = game.haveIGraded
    const getSubmissionToGrade = () => {
        subscription?.unsubscribe()
        subscription = game.getSubmissionToGrade()
    }

    useEffect(() => {
        getSubmissionToGrade()

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const submissionToGrade = game.submissionToGrade

    if (!submissionToGrade) {
        return null
    }

    const answers = submissionToGrade.submissionToGrade.answers
    let grading = new GradeSubmissionModel(
        submissionToGrade.player.id,
        Object.fromEntries(
            Object.entries(answers).map(([category, answer]) => [
                category,
                answer.verdict!,
            ]),
        ),
    )

    const submitGrading = (values: GradeSubmissionModel) => {
        subscription?.unsubscribe()
        subscription = game.gradeSubmission(values).add(() => {
            grading = values
        })
    }

    const validate = (values: GradeSubmissionModel) => {
        const errors: Record<Category, string> = {}

        game.categories.forEach((category) => {
            if (!values.verdicts[category]) {
                errors[
                    category as Category
                ] = `Please select a verdict for ${category}`
            }
        })

        return errors
    }

    return (
        <Formik
            enableReinitialize
            validateOnChange
            validateOnMount
            validate={validate}
            initialValues={grading}
            initialErrors={{ error: '' }}
            onSubmit={submitGrading}
        >
            {({ handleSubmit, isValid, values }) => {
                return (
                    <>
                        <main className="">
                            {game.submissionToGrade ? (
                                <div className="m-[-1.75rem] w-[calc(100%+3.5rem)] flex flex-col">
                                    <div className="flex justify-center">
                                        <span className="text-xs p-4">
                                            Grading submission of{' '}
                                            <span className="text-[var(--primary)]">
                                                {
                                                    game.submissionToGrade
                                                        .player.name
                                                }
                                            </span>
                                        </span>
                                    </div>
                                    <div className="grid gap-1">
                                        {Object.entries(answers).map(
                                            ([category, answer]) => (
                                                <GradingField
                                                    key={category}
                                                    category={category}
                                                    answer={answer}
                                                    values={grading}
                                                >
                                                    <span className="text-sm mb-2 block">
                                                        {category}
                                                    </span>
                                                    <span>{answer}</span>
                                                </GradingField>
                                            ),
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <LoaderOverlay />
                            )}
                        </main>
                        {isValid && !haveIGraded && (
                            <footer>
                                <form
                                    className="w-full"
                                    onSubmit={handleSubmit}
                                >
                                    <MenuButtonList>
                                        <MenuButton
                                            color="var(--green)"
                                            type="submit"
                                            innerText={values.score}
                                            innerTextColor="white"
                                        >
                                            <span>Submit grading</span>
                                        </MenuButton>
                                    </MenuButtonList>
                                </form>
                            </footer>
                        )}
                    </>
                )
            }}
        </Formik>
    )
})
