import { observer } from 'mobx-react'
import React from 'react'
import { gameManagerState } from '../../modules/game'
import { roomState } from '../../modules/rooms'
import { CardetGamePage } from './cardet'
import { PlayOptionsPage } from './options.page'
import { RoomPage } from './room.page'
import { TickTenGamePage } from './tick-ten'

export const PlayPage = observer(() => {
    const room = roomState.room
    const cardetGame = gameManagerState.cardetGame
    const tickTenGame = gameManagerState.tickTenGame

    const Page = React.useMemo(() => (room ? RoomPage : PlayOptionsPage), [
        room,
    ])

    if (cardetGame) return <CardetGamePage />
    if (tickTenGame) return <TickTenGamePage />

    return <Page />
})
