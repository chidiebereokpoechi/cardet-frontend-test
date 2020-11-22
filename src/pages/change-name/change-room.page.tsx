import { Formik } from 'formik'
import { observer } from 'mobx-react'
import React from 'react'
import { BackButton, Button, MenuPageWrapper } from '../../components'

export const ChangeNamePage = observer(() => {
  return (
    <MenuPageWrapper>
      <header>
        <BackButton to="/play" />
        <span>Change name</span>
      </header>
      <main>
        <div className="w-100">
          <Formik
            initialValues={{ name_id: '' }}
            onSubmit={() => {
              console.log('submitted')
            }}
          >
            {({ handleSubmit, isValid }) => (
              <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-center mt-5">
                  <Button type="submit" disabled={!isValid}>
                    <span>Change name</span>
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </main>
    </MenuPageWrapper>
  )
})
