import { observer } from 'mobx-react'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { JoinRoomPage, MainMenuPage, PlayPage } from '../../pages'
import { app_history } from '../../util/app-history'
import { PingMeter } from '../layout'

export const GameRouter = observer(() => {
  return (
    <React.Fragment>
      <PingMeter />
      <Router history={app_history}>
        <Switch>
          <Route exact path="/" component={MainMenuPage} />
          <Route exact path="/play" component={PlayPage} />
          <Route exact path="/play/join-room" component={JoinRoomPage} />
        </Switch>
      </Router>
    </React.Fragment>
  )
})
