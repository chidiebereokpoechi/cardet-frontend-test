import { AnimateSharedLayout } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import Confetti from 'react-confetti'
import { RefreshCcw, X } from 'react-feather'
import { CircleButton, GamePageWrapper } from '../../components'
import { useGame } from '../../util'
import { app_history } from '../../util/app-history'
import { CenterCards, PlayerCards, PlayersArea } from './components'

export const GamePage = observer(() => {
  const { manager, game } = useGame()

  const endGame = React.useCallback(() => {
    return manager.endGame()
  }, [manager])

  React.useEffect(() => {
    const unblock = app_history.block(
      'Are you sure you want to exit the current game',
    )

    return () => unblock()
  }, [])

  return (
    <GamePageWrapper>
      {game.game_over && <Confetti />}
      <header className="justify-content-between align-items-center">
        <CircleButton onClick={() => manager.getGameState()}>
          <RefreshCcw />
        </CircleButton>
        <CircleButton onClick={() => endGame()}>
          <X />
        </CircleButton>
      </header>
      <main>
        <AnimateSharedLayout type="crossfade">
          <PlayersArea />
          <CenterCards />
          <PlayerCards />
        </AnimateSharedLayout>
      </main>
      <footer></footer>
    </GamePageWrapper>
  )
})
