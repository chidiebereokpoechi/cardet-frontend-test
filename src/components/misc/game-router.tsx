import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import {
  ChangeNamePage,
  JoinRoomPage,
  MainMenuPage,
  PlayPage,
} from '../../pages'
import { app_history } from '../../util/app-history'

export const GameRouter = () => {
  return (
    <Router history={app_history}>
      <Switch>
        <Route exact path="/" component={MainMenuPage} />
        <Route exact path="/change-name" component={ChangeNamePage} />
        <Route exact path="/play" component={PlayPage} />
        <Route exact path="/play/join-room" component={JoinRoomPage} />
      </Switch>
    </Router>
  )
}
