import { Field, Formik } from 'formik'
import React from 'react'
import { Subscription } from 'rxjs'
import styled from 'styled-components'
import { Button } from '../../../components'
import { UpdateUserModel } from '../../../modules/user/models'

interface Props {
    name: string
    changeName: (model: UpdateUserModel) => Subscription
}

enum NameValidationErrors {
    TOO_SHORT = 'Too short',
    TOO_LONG = 'Too long',
    IDENTICAL = 'Identical',
}

const StyledForm = styled.form`
    font-size: 1rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
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

export const ChangeNameBar: React.FC<Props> = ({ name, changeName }) => {
    const validate = React.useCallback(
        (model: UpdateUserModel) => {
            let error: string | null = null

            if (name === model.name) {
                error = NameValidationErrors.IDENTICAL
            } else if (model.name.length < 2) {
                error = NameValidationErrors.TOO_SHORT
            } else if (model.name.length > 15) {
                error = NameValidationErrors.TOO_LONG
            }

            return error ? { name: error } : {}
        },
        [name],
    )

    return (
        <React.Fragment>
            <Formik
                enableReinitialize
                initialErrors={{ name: NameValidationErrors.IDENTICAL }}
                validate={validate}
                validateOnChange
                validateOnMount
                initialValues={new UpdateUserModel(name)}
                onSubmit={(values, actions) => {
                    actions.setSubmitting(true)
                    changeName(values).add(actions.setSubmitting(false))
                }}
            >
                {({ handleSubmit, isValid, values, errors }) => {
                    return (
                        <React.Fragment>
                            <StyledForm onSubmit={handleSubmit}>
                                <Field
                                    className={
                                        'name-input' +
                                        (values.name === name
                                            ? ' identical'
                                            : '')
                                    }
                                    name="name"
                                />
                                {isValid && (
                                    <Button type="submit">
                                        <span>Change name</span>
                                    </Button>
                                )}
                            </StyledForm>
                            <b
                                style={{
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: 'center',
                                    marginTop: '1rem',
                                    fontSize: '.75rem',
                                }}
                            >
                                {!errors?.name || values.name === name ? (
                                    <span>
                                        {values.name === name
                                            ? 'Your current name'
                                            : 'Perfect!'}
                                    </span>
                                ) : (
                                    <span className="danger">
                                        {errors.name}
                                    </span>
                                )}
                            </b>
                        </React.Fragment>
                    )
                }}
            </Formik>
        </React.Fragment>
    )
}
