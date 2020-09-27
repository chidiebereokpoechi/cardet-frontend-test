import { Formik } from 'formik'
import { observer } from 'mobx-react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import {
  BackButton,
  Button,
  MenuPageWrapper,
  RoomCodeInput,
} from '../../components'
import { roomState } from '../../modules/rooms'

interface JoinRoomModel {
  room_id: string
}

export const JoinRoomPage = observer(() => {
  const history = useHistory()
  const room = roomState.room

  const joinRoom = React.useCallback((values: JoinRoomModel) => {
    roomState.joinRoom(values.room_id)
  }, [])

  const validate = React.useCallback((values: JoinRoomModel) => {
    if (values.room_id.length !== 4) {
      console.log(values)
      return { room_id: 'Incorrect room id format' }
    }

    return {}
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
        <div className="w-100">
          <Formik
            initialValues={{ room_id: '' }}
            validate={validate}
            onSubmit={joinRoom}
          >
            {({ handleSubmit, isValid }) => (
              <form onSubmit={handleSubmit}>
                <RoomCodeInput />
                <div className="d-flex justify-content-center mt-5">
                  <Button type="submit" disabled={!isValid}>
                    <span>Join room</span>
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
