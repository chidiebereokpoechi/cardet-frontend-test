import { observer } from 'mobx-react'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { JoinRoomPage, MainMenuPage, PlayPage } from '../../pages'
import { PingMeter } from '../layout'

export const GameRouter = observer(() => {
    return (
        <React.Fragment>
            <PingMeter />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainMenuPage />} />
                    <Route path="/play" element={<PlayPage />} />
                    <Route path="/play/join-room" element={<JoinRoomPage />} />
                </Routes>
            </BrowserRouter>
        </React.Fragment>
    )
})
