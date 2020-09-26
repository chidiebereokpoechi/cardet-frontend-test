import { AnimatePresence, motion } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import styled from 'styled-components'
import { Player, SerializedCard } from '../../../modules/game'
import { useGame } from '../../../util'
import { PlayerNameTag } from './player-name-tag'
import { PlayingCard } from './playing-card'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  place-content: center;
  padding: 20px;

  .cards {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-left: 40px;
    margin-top: 40px;
    margin-bottom: 20px;
  }

  .card-wrapper {
    margin-left: -40px;
    margin-top: -40px;
  }

  .player-name {
    font-size: 80%;
    font-weight: bold;
  }
`

interface CardWrapperProps {
  card: SerializedCard
}

const CardWrapper: React.FC<CardWrapperProps> = ({ card }) => {
  return (
    <motion.div
      className="card-wrapper"
      initial={{
        y: 50,
      }}
      animate={{
        y: 0,
      }}
    >
      <PlayingCard {...card} />
    </motion.div>
  )
}
interface Props {
  player: Player
}

export const PlayerDeck: React.FC<Props> = observer(({ player }) => {
  const {
    game: { current_player, game_over },
  } = useGame()
  const active = !game_over && player === current_player

  return (
    <Wrapper className={active ? 'active' : ''}>
      <div className="cards">
        <AnimatePresence>
          {player.cards.map((card, index) => (
            <CardWrapper key={card.id} card={card} />
          ))}
        </AnimatePresence>
      </div>
      <PlayerNameTag id={player.id} name={player.name} />
    </Wrapper>
  )
})
