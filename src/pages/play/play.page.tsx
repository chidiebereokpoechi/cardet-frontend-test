import { observer } from 'mobx-react'
import React from 'react'
import { gameManagerState } from '../../modules/game'
import { roomState } from '../../modules/rooms'
import { GamePage } from './game.page'
import { PlayOptionsPage } from './options.page'
import { RoomPage } from './room.page'

export const PlayPage = observer(() => {
  const room = roomState.room
  const game = gameManagerState.game
  const Page = React.useMemo(() => (room ? RoomPage : PlayOptionsPage), [room])
  if (game) return <GamePage />
  return <Page />
})
