import { Formik } from 'formik'
import { observer } from 'mobx-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    BackButton,
    MenuButton,
    MenuButtonList,
    MenuPageWrapper,
    RoomCodeInput,
} from '../../components'
import { roomState } from '../../modules/rooms'

interface JoinRoomModel {
    room_id: string
}

const isValidCode = (code: string) => code.length === 4

export const JoinRoomPage = observer(() => {
    const navigate = useNavigate()
    const location = useLocation()
    const room = roomState.room

    // Extract room code from query string
    const queryParams = new URLSearchParams(location.search)
    const queryRoomId = queryParams.get('code') || ''

    const [isJoining, setIsJoining] = useState(false)

    const joinRoom = async (room_id: string) => {
        setIsJoining(true) // Prevent multiple submissions
        roomState.joinRoom(room_id)
        setIsJoining(false)
    }

    const validate = React.useCallback((values: JoinRoomModel) => {
        if (!isValidCode(values.room_id)) {
            return { room_id: 'Room ID has format XXXX' }
        }

        return {}
    }, [])

    React.useEffect(() => {
        if (room) navigate('/play', { replace: true })
    }, [room, navigate])

    useEffect(() => {
        if (!room && queryRoomId && isValidCode(queryRoomId) && !isJoining) {
            joinRoom(queryRoomId) // Auto-join if valid room code is present
        }
    }, [room, joinRoom, queryRoomId])

    return (
        <Formik
            initialValues={{ room_id: queryRoomId }}
            validate={validate}
            onSubmit={({ room_id }) => joinRoom(room_id)}
            enableReinitialize // Ensures the form updates when query params change
        >
            {({ values, handleSubmit, isValid }) => (
                <MenuPageWrapper>
                    <header>
                        <BackButton to="/play" />
                        <span>Join room</span>
                    </header>
                    <main>
                        <form className="w-full" onSubmit={handleSubmit}>
                            <RoomCodeInput />
                        </form>
                    </main>
                    <footer>
                        <div className="w-full">
                            <MenuButtonList>
                                <MenuButton
                                    onClick={() => joinRoom(values.room_id)}
                                    disabled={!isValid}
                                >
                                    <span>Join room</span>
                                </MenuButton>
                            </MenuButtonList>
                        </div>
                    </footer>
                </MenuPageWrapper>
            )}
        </Formik>
    )
})
