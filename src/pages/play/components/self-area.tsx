import { AnimatePresence, motion } from 'framer-motion'
import { map } from 'lodash'
import React from 'react'
import styled from 'styled-components'
import { Game, gameManagerState } from '../../../modules/game'
import { PlayingCard } from './cards'

const Wrapper = styled(motion.div)`
  transition: 0.5s ease;
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  .turn-cryer {
    font-weight: 700;
    margin-bottom: 2rem;
  }

  .cards {
    display: flex;
    place-content: center;
    place-items: center;
    flex-wrap: wrap;
    gap: -1rem;
  }

  .card-container {
    margin-left: -10px;
    margin-top: -5px;
  }
`

export const SelfArea = () => {
  const game = gameManagerState.game as Game
  const { is_my_turn } = game
  const ref = React.useRef(null)

  return (
    <Wrapper className="self-area" ref={ref}>
      <div className="turn-cryer">
        <span>{is_my_turn && 'Your turn'}</span>
      </div>
      <motion.div className="cards">
        <AnimatePresence>
          {map(game.cards, (card, index) => (
            <div className="card-container" key={card.id}>
              <PlayingCard
                card={card}
                key={card.id}
                index={index}
                dragConstraints={ref}
              />
            </div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Wrapper>
  )
}
