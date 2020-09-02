import { map } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Menu, X } from 'react-feather'
import { CircleButton, GamePageWrapper } from '../../components'
import { Game, gameManagerState } from '../../modules/game'
import { app_history } from '../../util/app-history'
import { FacedDownCard, PlayerDeck, PlayingCard, SelfArea } from './components'

export const GamePage = observer(() => {
  const game = gameManagerState.game as Game

  const endGame = React.useCallback(() => {
    return gameManagerState.endGame()
  }, [])

  React.useEffect(() => {
    const unblock = app_history.block(
      'Are you sure you want to exit the current game'
    )
    return () => unblock()
  }, [])

  return (
    <GamePageWrapper>
      <header className="justify-content-between align-items-center">
        <CircleButton>
          <Menu />
        </CircleButton>
        <CircleButton onClick={() => endGame()}>
          <X />
        </CircleButton>
      </header>
      <main>
        <div className="players-area">
          {map(game.other_players, (player) => (
            <PlayerDeck
              name={player.name}
              cards_count={player.cards_count}
              player_id={player.id}
              key={player.id}
            />
          ))}
        </div>
        <div className="center-area">
          <FacedDownCard
            initial={{ height: '4.5rem', width: '3.5rem' }}
            onClick={() => gameManagerState.pick()}
          />
          <PlayingCard
            key={game.center_card.id}
            card={game.center_card}
            onClick={() => gameManagerState.play()}
          />
        </div>
        {/* <div className="self-area">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, 2rem)',
              gridAutoRows: '2rem',
              gap: '.5rem',
              justifyContent: 'center',
              justifyItems: 'center',
              alignItems: 'center',
              padding: '2rem 0',
            }}
          >
            {map(game.cards, (card, index) => (
              <PlayingCard card={card} key={index} index={index} />
            ))}
          </div>
        </div> */}
        <SelfArea />
      </main>
      <footer></footer>
    </GamePageWrapper>
  )
})
