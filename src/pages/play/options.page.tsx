import { observer } from 'mobx-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
    BackButton,
    MenuButton,
    MenuButtonList,
    MenuLinkButton,
    MenuPageWrapper,
} from '../../components'
import { roomState } from '../../modules/rooms'

export const PlayOptionsPage = observer(() => {
    const room = roomState.room
    const navigate = useNavigate()

    const createRoom = React.useCallback(() => {
        return roomState.createRoom()
    }, [])

    React.useEffect(() => {
        if (room) navigate('/play/room')
    }, [room, navigate])

    return (
        <MenuPageWrapper>
            <header>
                <div
                    className="grid items-center w-full gap-8 grid-cols-[var(--button-height) 1fr var(--button-height)]"
                    style={{
                        gridTemplateColumns:
                            'var(--button-height) 1fr var(--button-height)',
                    }}
                >
                    <BackButton to="/" />
                    <div className="flex justify-center">
                        <span>Play</span>
                    </div>
                </div>
            </header>
            <main />
            <footer>
                <div className="w-100">
                    <MenuButtonList>
                        <MenuButton color="#4D8275" onClick={createRoom}>
                            Create room
                        </MenuButton>
                        <MenuLinkButton color="#744D82" to="/play/join-room">
                            Join room
                        </MenuLinkButton>
                    </MenuButtonList>
                </div>
            </footer>
        </MenuPageWrapper>
    )
})
