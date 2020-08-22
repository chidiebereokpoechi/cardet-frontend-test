import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { JoinRoomPage, MainMenuPage, PlayOptionsPage } from '../../pages'

export const GameRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={MainMenuPage} />
        <Route exact path="/play" component={PlayOptionsPage} />
        <Route exact path="/play/join-room" component={JoinRoomPage} />
      </Switch>
    </BrowserRouter>
  )
}
