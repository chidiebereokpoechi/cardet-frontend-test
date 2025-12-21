import { Field, Formik } from 'formik'
import React from 'react'
import { Subscription } from 'rxjs'
import styled from 'styled-components'
import { Button } from '../../../../components'
import { RecordAnswerModel } from '../../../../modules/game/tick-ten/models'
import { debounce } from 'lodash'

interface Props {
    category: string
    answer?: string
    recordAnswer: (model: RecordAnswerModel) => Subscription
}

enum AnswerValidationErrors {
    TOO_SHORT = 'Too short',
}

const StyledForm = styled.form`
    font-size: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    width: 100%;

    .name-input {
        padding: 0.5rem 1rem;
        background: black;
        border-radius: 1rem;
        color: white;
        font-weight: bold;
        user-select: text;
        height: 3rem;
        border: 3px solid var(--primary);
        color: var(--primary);
    }

    .name-input.identical {
        border-color: #00ffb2;
        color: #00ffb2;
    }

    .submit-button {
        width: 3rem;
    }

    .submit-button:not(:disabled) {
        background: white;
        color: black;
    }
`

export const RecordAnswerField: React.FC<Props> = ({
    category,
    answer,
    recordAnswer,
}) => {
    let subscription: Subscription | undefined

    const validate = (values: RecordAnswerModel) => {
        if (values.answer.length < 2) {
            return { answer: AnswerValidationErrors.TOO_SHORT }
        }
        return {}
    }

    const debouncedSubmit = React.useMemo(
        () =>
            debounce((model: RecordAnswerModel) => {
                if (model.answer.length < 2) {
                    return
                }

                subscription = recordAnswer(model)
                return subscription
            }, 1000),
        [],
    )

    React.useEffect(() => {
        return () => {
            debouncedSubmit.cancel()
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
                    debouncedSubmit(values)
                }}
            >
                {({
                    handleSubmit,
                    submitForm,
                    values,
                    errors,
                    handleChange,
                }) => {
                    return (
                        <React.Fragment>
                            <StyledForm onSubmit={handleSubmit}>
                                <span>{category}</span>
                                <Field
                                    onChange={(e: any) => {
                                        handleChange('answer')(e)
                                        submitForm()
                                    }}
                                    className={
                                        'name-input' +
                                        (values.answer === answer
                                            ? ' identical'
                                            : '')
                                    }
                                    name="answer"
                                />
                            </StyledForm>
                        </React.Fragment>
                    )
                }}
            </Formik>
        </React.Fragment>
    )
}
