import { motion, MotionProps, Variants } from 'framer-motion'
import { findIndex, includes, random } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import { Shield, Slash, Wind } from 'react-feather'
import styled from 'styled-components'
import {
  Card,
  CardType,
  CardValue,
  Game,
  gameManagerState,
} from '../../../modules/game'

export const FacedDownCard = styled(motion.div)`
  background: linear-gradient(45deg, #080808, #363d44);
  border: 1px solid #45505d;
  height: 3rem;
  width: 2rem;
  border-radius: 0.25rem;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.35);
`

export const DumbCard = styled(motion.div)`
  background: white;
  border: 3px solid rgb(255 255 255 / 48%);
  height: 4.5rem;
  width: 3.5rem;
  border-radius: 0.25rem;
  color: white;
  padding: 0.5rem 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 1px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.35);

  .order {
    position: absolute;
    top: -10px;
    right: -10px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    width: 20px;
    border-radius: 100%;
    background: white;
    font-size: 70%;
    font-weight: bold;
    color: black;
    text-shadow: none;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.35);
    border: 1px solid #45505d;
  }

  .value {
    display: flex;
    font-weight: 700;
    flex-direction: column;
    font-size: 200%;
  }
`

interface Props {
  card: Card
  index?: number
  onClick?: () => any
  dragConstraints?: MotionProps['dragConstraints']
}

export const PlayingCard: React.FC<Props> = observer(
  ({ card, index, onClick, dragConstraints }) => {
    const { type, value } = card
    const game = gameManagerState.game as Game

    const background = React.useMemo(() => {
      switch (type) {
        case CardType.ALPHA:
          return 'red'
        case CardType.BRAVO:
          return 'orange'
        case CardType.CHARLIE:
          return 'yellow'
        case CardType.DELTA:
          return 'green'
        case CardType.ECHO:
          return 'blue'
        case CardType.FOXTROT:
          return 'indigo'
        case CardType.ANY:
          return 'gray'
      }
    }, [type])

    const playable = React.useMemo(() => includes(game.playable_cards, card), [
      game.playable_cards,
      card,
    ])

    const selected = React.useMemo(
      () =>
        includes(game.selected_indices, index)
          ? findIndex(game.selected_indices, (_) => _ === index)
          : false,
      [game.selected_indices, index]
    )

    const display = React.useMemo(() => {
      switch (value) {
        case CardValue.ANY:
          return '?'
        case CardValue.PICK_TWO:
          return '+2'
        case CardValue.PICK_THREE:
          return '+3'
        case CardValue.GENERAL_MARKET:
          return <Wind />
        case CardValue.BLOCK:
          return <Shield />
        case CardValue.FREEZE:
          return <Slash />
        default:
          return value
      }
    }, [value])

    const variants: Variants = React.useMemo(
      () => ({
        not_turn: {
          zIndex: 0,
          filter: 'brightness(0.5)',
          scale: 1,
          y: 0,
        },
        unplayable: {
          zIndex: 0,
          filter: 'brightness(0.4)',
          scale: 1,
          y: 0,
        },
        playable: {
          zIndex: 0,
          filter: 'brightness(1)',
          scale: 1.1,
          margin: 0,
          y: 0,
        },
        selected: {
          zIndex: selected !== false ? selected + 1 : 1,
          filter: 'brightness(1)',
          scale: 1.125,
          opacity: 1,
          y: -10,
        },
      }),
      [selected]
    )

    const variant = React.useMemo(() => {
      if (index !== undefined && !game.is_my_turn) {
        return 'not_turn'
      }

      if (selected !== false) {
        return 'selected'
      }

      if (index !== undefined) {
        return playable ? 'playable' : 'unplayable'
      }

      return 'default'
    }, [game.is_my_turn, playable, selected, index])

    const toggleCard = React.useCallback(() => {
      if (playable) {
        game.toggleCard(index as number)
        return
      }

      game.clearSelection()
    }, [game, index, playable])

    return (
      <DumbCard
        transition={{ duration: 0.1 }}
        initial={{
          background: `var(--${background})`,
          rotate: random(-2, 2),
          opacity: 1,
          zIndex: 0,
        }}
        exit={{
          y: -200,
          opacity: 0,
        }}
        animate={variant}
        variants={variants}
        onClick={onClick ?? toggleCard}
      >
        {selected !== false && <span className="order">{selected + 1}</span>}
        <motion.span
          initial={{ y: typeof display === 'number' ? 5 : 0 }}
          className="value"
        >
          {display}
        </motion.span>
      </DumbCard>
    )
  }
)