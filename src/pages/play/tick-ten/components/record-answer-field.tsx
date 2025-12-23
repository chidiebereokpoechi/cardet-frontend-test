import { Field, Formik } from 'formik'
import { motion } from 'framer-motion'
import { trim } from 'lodash'
import React from 'react'
import { Check, Loader } from 'react-feather'
import { Subscription } from 'rxjs'
import styled from 'styled-components'
import { RecordAnswerModel } from '../../../../modules/game/tick-ten/models'
import { classNames, useTickTenGame } from '../../../../util'

interface Props {
    category: string
    answer?: string
    disabled?: boolean
    recordAnswer: (model: RecordAnswerModel) => Subscription
}

const StyledForm = styled.form`
    font-size: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    width: 100%;

    .name-input {
        padding: 0.5rem 1rem;
        background: #121518;
        border-radius: 1rem;
        color: white;
        font-weight: bold;
        user-select: text;
        height: 3rem;
        border: 3px solid #121518;
        border-color: white;
        color: white;
    }

    .name-input.identical {
        border-color: var(--green);
        color: var(--green);
    }

    input:disabled {
        background: #121518;
        border-color: var(--understated-grey);
        color: var(--understated-grey);
        cursor: not-allowed;
    }

    .submit-button {
        background: white;
        color: #2b2e33;
        border-radius: 1rem;
        border: none;
        outline: none;
        height: var(--button-height) !important;
        width: var(--button-height) !important;
        appearance: none;
        padding: 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .submit-button.identical {
        color: var(--green);
    }

    .submit-button:disabled {
        background: #121518;
        color: var(--understated-grey);
    }
`

export const RecordAnswerField: React.FC<Props> = ({
    category,
    answer,
    recordAnswer,
    disabled,
}) => {
    let subscription: Subscription | undefined
    const { game } = useTickTenGame()

    const validate = (values: RecordAnswerModel) => {
        const trimmedAnswer = trim(values.answer)

        if (
            game.turn.letter.toUpperCase() !==
            trimmedAnswer.charAt(0)?.toUpperCase()
        ) {
            return {
                answer: `must start with ${game.turn.letter.toUpperCase()}`,
            }
        }

        if (trimmedAnswer.length <= 1) {
            return { answer: 'is too short' }
        }

        return {}
    }

    const debouncedSubmit = React.useMemo(
        () => (model: RecordAnswerModel) => {
            if (trim(model.answer).length <= 1) {
                return
            }

            subscription = recordAnswer(model)
            return subscription
        },
        [],
    )

    React.useEffect(() => {
        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    return (
        <React.Fragment>
            <Formik
                enableReinitialize
                initialErrors={{}}
                validate={validate}
                validateOnChange
                initialValues={new RecordAnswerModel(category, answer ?? '')}
                onSubmit={(values, actions) => {
                    actions.setSubmitting(true)
                    debouncedSubmit(values)?.add(() => {
                        actions.setSubmitting(false)
                    })
                }}
            >
                {({
                    handleSubmit,
                    initialValues,
                    isValid,
                    values,
                    errors,
                    isSubmitting,
                }) => {
                    const isIdentical =
                        values.answer === answer && values.answer.length > 2

                    const disableButton =
                        disabled ||
                        !isValid ||
                        isSubmitting ||
                        values === initialValues ||
                        isIdentical

                    return (
                        <React.Fragment>
                            <StyledForm onSubmit={handleSubmit}>
                                <div className="flex items-center">
                                    <span className="text-xs">{category}</span>
                                    {errors.answer && (
                                        <span className="text-[var(--red)] text-xs ml-1">
                                            {errors.answer}
                                        </span>
                                    )}
                                </div>
                                <div className="flex">
                                    <Field
                                        type="text"
                                        className={classNames(
                                            'flex-1 name-input',
                                            isIdentical && 'identical',
                                        )}
                                        name="answer"
                                        autoCapitalize="off"
                                        autoComplete="off"
                                        spellCheck={false}
                                        autoCorrect="off"
                                        disabled={disabled}
                                        onBlur={() => {
                                            if (!disabled) handleSubmit()
                                        }}
                                    />
                                    <button
                                        disabled={disableButton}
                                        className={classNames(
                                            'submit-button ml-3',
                                            disableButton
                                                ? 'cursor-not-allowed'
                                                : 'hover:scale-105 transition-transform',
                                        )}
                                        type="submit"
                                    >
                                        {isSubmitting ? (
                                            <motion.div
                                                initial={{ rotate: 0 }}
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    loop: true,
                                                    repeat: Infinity,
                                                    duration: 2,
                                                    ease: 'linear',
                                                }}
                                            >
                                                <Loader />
                                            </motion.div>
                                        ) : (
                                            <Check />
                                        )}
                                    </button>
                                </div>
                            </StyledForm>
                        </React.Fragment>
                    )
                }}
            </Formik>
        </React.Fragment>
    )
}
