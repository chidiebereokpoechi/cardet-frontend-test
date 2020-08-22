import { Field, Formik } from 'formik'
import { observer } from 'mobx-react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { BackButton, Button, MenuPageWrapper, UserPin } from '../../components'
import { roomState } from '../../modules/rooms'
import { User, userState } from '../../modules/user'

export const JoinRoomPage = observer(() => {
  const history = useHistory()
  const user = userState.user as User
  const room = roomState.room

  const joinRoom = React.useCallback((values: { room_id: string }) => {
    roomState.joinRoom(values.room_id)
  }, [])

  React.useEffect(() => {
    if (room) history.replace('/play')
  }, [room, history])

  return (
    <MenuPageWrapper>
      <header>
        <BackButton to="/play" />
        <span>Join room</span>
      </header>
      <main>
        <div>
          <Formik initialValues={{ room_id: '' }} onSubmit={joinRoom}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field name="room_id" placeholder="Room id" />
                <Button type="submit">
                  <span>Join room</span>
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </main>
      <footer>
        <UserPin {...(user as User)} />
      </footer>
    </MenuPageWrapper>
  )
})
