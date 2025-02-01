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

    const play = React.useCallback(() => {
        if (!game.game_over) manager.play()
    }, [game.game_over, manager])

    return (
        <motion.div
            className="card-wrapper"
            style={{
                rotate: random(-15, 15),
            }}
        >
            <PlayingCard key={card.id} {...card} onClick={play} />
        </motion.div>
    )
})

export const CenterCards: React.FC = observer(() => {
    const { game, manager } = useGame()

    const noMoves =
        !game.game_over && game.is_my_turn && game.playable_cards.length === 0

    const pick = React.useCallback(() => {
        if (!game.game_over) manager.pick()
    }, [game.game_over, manager])

    return (
        <Wrapper className="center-area">
            <div className="market">
                <PlayingCard
                    onClick={pick}
                    animate={{
                        filter: noMoves
                            ? [
                                  'drop-shadow(0 0 0px rgba(255, 255, 255, 0.3))',
                                  'drop-shadow(0 0 12px rgba(255, 255, 255, 0.9))',
                                  'drop-shadow(0 0 0px rgba(255, 255, 255, 0.3))',
                              ]
                            : 'drop-shadow(0 0 0px rgba(255, 255, 255, 0))',
                        scale: noMoves ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                        duration: 2,
                        repeat: noMoves ? Infinity : 0,
                        loop: noMoves ? Infinity : 0,
                        ease: 'easeInOut',
                    }}
                />
            </div>
            <div className="center-cards" ref={rootState.center_card}>
                {game.center_cards.map((card) => (
                    <CardWrapper key={card.id} {...card} />
                ))}
            </div>
        </Wrapper>
    )
})
