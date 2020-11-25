import { ErrorMessage, Field, Formik } from 'formik'
import React from 'react'
import { RiArrowRightCircleFill } from 'react-icons/ri'
import styled from 'styled-components'
import { UpdateUserModel } from '../../../modules/user/models'

interface Props {
  name: string
  changeName: (model: UpdateUserModel) => void
}

enum NameValidationErrors {
  TOO_SHORT = 'Too short',
  TOO_LONG = 'Too long',
  IDENTICAL = 'Identical',
}

const StyledForm = styled.form`
  font-size: 1rem;
  display: grid;
  grid-template-columns: 1fr 50px;
  gap: 1rem;
  width: 100%;

  > * {
    background: transparent;
    border: 2px solid white;
    border-radius: 5px;
    color: white;
  }

  .name-input {
    padding: 0.5rem 1rem;
    color: white;
    font-weight: bold;
    user-select: text;
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
        onSubmit={changeName}
      >
        {({ handleSubmit, isValid, values, errors }) => (
          <React.Fragment>
            <b style={{ width: '100%', marginBottom: 10, fontSize: '.75rem' }}>
              {!errors?.name || values.name === name ? (
                <span>
                  {values.name === name ? 'Your current name' : 'Perfect!'}
                </span>
              ) : (
                <span className="danger">{errors.name}</span>
              )}
            </b>
            <StyledForm onSubmit={handleSubmit}>
              <Field className="name-input" name="name" />
              <button
                disabled={!isValid}
                className="submit-button"
                type="submit"
              >
                <RiArrowRightCircleFill />
              </button>
            </StyledForm>
          </React.Fragment>
        )}
      </Formik>
    </React.Fragment>
  )
}
