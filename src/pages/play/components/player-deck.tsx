import { AnimatePresence, motion, Variants } from 'framer-motion'
import { map, random, range } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import styled from 'styled-components'
import { useGame } from '../../../util'
import { FacedDownCard } from './cards'

const Wrapper = React.memo(styled(motion.div)`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .name {
    text-shadow: 0 2px 0px #000000;
    padding: 1rem;
    color: #b4bdba;
    margin-top: 1rem;
    font-weight: bold;
    font-size: 80%;
    text-align: center;
  }

  .deck {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, 0.5rem);
    grid-auto-rows: 1.5rem;
    justify-content: center;
    padding-right: 1rem;
    padding-bottom: 1.5rem;
  }
`)

interface Props {
  name: string
  cards_count: number
  player_id: string
  style?: CSSStyleDeclaration
}

export const PlayerDeck: React.FC<Props> = observer(
  ({ name, player_id, cards_count }) => {
    const game = useGame()
    const variants: Variants = {
      default: { scale: 1, color: '#b4bdba' },
      turn: { scale: 1.2, color: '#fff' },
    }

    const variant = React.useMemo<'default' | 'turn'>(() => {
      if (player_id === game.current_player.id) {
        return 'turn'
      }

      return 'default'
    }, [player_id, game.current_player])

    return (
      <Wrapper>
        <div className="deck">
          <AnimatePresence initial={false}>
            {map(range(cards_count), (index) => (
              <FacedDownCard
                key={index}
                initial={{
                  rotate: random(-2, 2),
                  opacity: 1,
                  y: 200,
                  zIndex: 0,
                }}
                animate={{
                  y: 0,
                }}
                exit={{
                  rotate: random(-5, 5),
                  opacity: 0,
                  y: 200,
                }}
              />
            ))}
          </AnimatePresence>
        </div>
        <motion.span className="name" animate={variant} variants={variants}>
          {name}
        </motion.span>
      </Wrapper>
    )
  }
)
