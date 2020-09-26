import { motion } from 'framer-motion'
import { random } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import styled from 'styled-components'
import { Card } from '../../../modules/game'
import { rootState } from '../../../modules/root'
import { useGame } from '../../../util'
import { PlayingCard } from './playing-card'

const Wrapper = styled.div`
  display: flex;
  place-content: center;
  place-items: center;

  .market {
    margin-right: 20px;
  }

  .center-cards {
    position: relative;
    height: var(--card-height);
    width: var(--card-width);
  }

  .card-wrapper {
    position: absolute;
    left: 0;
    top: 0;
  }
`

const CardWrapper: React.FC<Card> = observer((card) => {
  const { manager, game } = useGame()

  return (
    <motion.div
      className="card-wrapper"
      style={{
        rotate: random(-15, 15),
      }}
    >
      <PlayingCard
        key={card.id}
        {...card}
        onClick={game.game_over ? undefined : () => manager.play()}
      />
    </motion.div>
  )
})

export const CenterCards: React.FC = observer(() => {
  const {
    game: { center_cards: cards, game_over },
    manager,
  } = useGame()

  return (
    <Wrapper className="center-area">
      <div className="market">
        <PlayingCard onClick={game_over ? undefined : () => manager.pick()} />
      </div>
      <div className="center-cards" ref={rootState.center_card}>
        {cards.map((card) => (
          <CardWrapper key={card.id} {...card} />
        ))}
      </div>
    </Wrapper>
  )
})
