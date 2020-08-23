import { observer } from 'mobx-react'
import React from 'react'
import { roomState } from '../../modules/rooms'
import { PlayOptionsPage } from './options.page'
import { RoomPage } from './room.page'

export const PlayPage = observer(() => {
  const room = roomState.room
  const Page = React.useMemo(() => (room ? RoomPage : PlayOptionsPage), [room])
  return <Page />
})
