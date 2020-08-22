import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { MainMenuPage } from '../../pages'

export const GameRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={MainMenuPage} />
      </Switch>
    </BrowserRouter>
  )
}
