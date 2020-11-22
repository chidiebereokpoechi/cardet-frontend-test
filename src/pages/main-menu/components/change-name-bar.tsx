import { Field, Formik } from 'formik'
import React from 'react'
import { RiArrowRightCircleFill } from 'react-icons/ri'
import styled from 'styled-components'
import { UpdateUserModel } from '../../../modules/user/models'

interface Props {
  name: string
  changeName: (model: UpdateUserModel) => void
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
  }

  .submit-button:not(:disabled) {
    background: white;
    color: black;
  }
`

export const ChangeNameBar: React.FC<Props> = ({ name, changeName }) => {
  const validate = React.useCallback(
    (model: UpdateUserModel) => {
      if (name === model.name) {
        return { name: 'Names are identical' }
      }

      if (model.name.length < 3) {
        return { name: 'Name is too short' }
      }

      if (model.name.length > 10) {
        return { name: 'Name is too long' }
      }

      return {}
    },
    [name],
  )

  return (
    <React.Fragment>
      <Formik
        enableReinitialize
        initialErrors={{ name: 'Names are identical' }}
        validate={validate}
        validateOnChange
        validateOnMount
        initialValues={new UpdateUserModel(name)}
        onSubmit={changeName}
      >
        {({ handleSubmit, isValid }) => (
          <React.Fragment>
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
