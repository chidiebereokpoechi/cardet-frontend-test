import { Field, Formik } from 'formik'
import React from 'react'
import { Subscription } from 'rxjs'
import styled from 'styled-components'
import { Button } from '../../../../components'
import { RecordAnswerModel } from '../../../../modules/game/tick-ten/models'
import { debounce, initial, trim } from 'lodash'
import { classNames, useTickTenGame } from '../../../../util'
import { Check, Loader, Save } from 'react-feather'
import { motion } from 'framer-motion'

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
        background: transparent;
        border-radius: 1rem;
        color: white;
        font-weight: bold;
        user-select: text;
        height: 3rem;
        border: 3px solid white;
        border-color: var(--primary);
        color: var(--primary);
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
                answer: `Answer must start with ${game.turn.letter.toUpperCase()}`,
            }
        }

        if (trimmedAnswer.length <= 1) {
            return { answer: 'Too short' }
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
                validateOnMount
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
                    const disableButton =
                        !isValid || isSubmitting || values === initialValues

                    return (
                        <React.Fragment>
                            <StyledForm onSubmit={handleSubmit}>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs">{category}</span>
                                    {errors.answer && (
                                        <span className="text-red-500 text-xs">
                                            {errors.answer}
                                        </span>
                                    )}
                                </div>
                                <div className="flex">
                                    <Field
                                        type="text"
                                        className={
                                            'flex-1 name-input' +
                                            (values.answer === answer &&
                                            values.answer.length > 2
                                                ? ' identical'
                                                : '')
                                        }
                                        name="answer"
                                        autoCapitalize="off"
                                        spellCheck="false"
                                        autoCorrect="off"
                                        disabled={disabled}
                                    />
                                    <button
                                        disabled={disableButton}
                                        className={classNames(
                                            'submit-button ml-3',
                                            disableButton
                                                ? 'bg-[#555555] text-[#888888] cursor-not-allowed'
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
