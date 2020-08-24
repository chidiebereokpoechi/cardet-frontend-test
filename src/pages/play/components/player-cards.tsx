import { AnimatePresence } from 'framer-motion'
import { map, random, range } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import styled from 'styled-components'
import { FacedDownCard } from './cards'

const Wrapper = React.memo(styled.div`
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;

  .name {
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
  style?: CSSStyleDeclaration
}

export const PlayerDeck: React.FC<Props> = observer(({ name, cards_count }) => {
  return (
    <Wrapper>
      <div className="deck">
        <AnimatePresence>
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
      <span className="name">{name}</span>
    </Wrapper>
  )
})
