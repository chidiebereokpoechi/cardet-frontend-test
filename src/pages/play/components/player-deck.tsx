import { AnimatePresence, motion, transform } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import styled from 'styled-components'
import { Player, SerializedCard } from '../../../modules/game'
import { useGame } from '../../../util'
import { Crown } from './crown'
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

  .card-counter {
    color: var(--gray);
    font-size: 80%;
  }
`

interface CardWrapperProps {
  card: SerializedCard
  degree: number
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
    game: { current_player },
  } = useGame()
  const total_cards = player.cards.length
  const input_range = [0, total_cards]
  const output_range = [5, 366]

  const active = player === current_player

  return (
    <Wrapper className={active ? 'active' : ''}>
      <div className="cards">
        <AnimatePresence>
          {player.cards.map((card, index) => (
            <CardWrapper
              key={card.id}
              degree={transform(index, input_range, output_range)}
              card={card}
            />
          ))}
        </AnimatePresence>
      </div>
      <div className="player-name">
        {active && <Crown />}
        <span>{player.name}</span>
      </div>
      <span className="card-counter">{total_cards} card(s)</span>
    </Wrapper>
  )
})
