import { Formik } from 'formik'
import { observer } from 'mobx-react'
import React from 'react'
import { useHistory } from 'react-router-dom'
import {
    BackButton,
    Button,
    MenuButton,
    MenuButtonList,
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
            return { room_id: 'Room ID has format XXXX' }
        }

        return {}
    }, [])

    React.useEffect(() => {
        if (room) history.replace('/play')
    }, [room, history])

    return (
        <Formik
            initialValues={{ room_id: '' }}
            isInitialValid={false}
            validate={validate}
            onSubmit={joinRoom}
        >
            {({ values, isValid }) => (
                <MenuPageWrapper>
                    <header>
                        <BackButton to="/play" />
                        <span>Join room</span>
                    </header>
                    <main>
                        <span>Enter room code</span>
                        <div className="w-100 mt-3">
                            <RoomCodeInput />
                        </div>
                    </main>
                    {isValid && (
                        <footer>
                            <div className="w-100">
                                <MenuButtonList>
                                    <MenuButton
                                        onClick={() => {
                                            joinRoom(values)
                                        }}
                                    >
                                        <span>Join room</span>
                                    </MenuButton>
                                </MenuButtonList>
                            </div>
                        </footer>
                    )}
                </MenuPageWrapper>
            )}
        </Formik>
    )
})
