import { motion, Variants } from 'framer-motion'
import { findIndex, includes } from 'lodash'
import { observer } from 'mobx-react'
import React from 'react'
import styled from 'styled-components'
import { PlayingCard } from '.'
import { IndexedCard, Player } from '../../../modules/game'
import { userState } from '../../../modules/user/user.state'
import { sound_manager, useGame } from '../../../util'
import { PlayerNameTag } from './player-name-tag'

const Wrapper = styled.div`
    /* background: rgba(0, 0, 0, 0.15); */
    display: flex;
    place-content: center;
    place-items: center;
    flex-direction: column;
    flex-wrap: wrap;
    padding: 20px;

    .cards {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-left: 10px;
        margin-top: 40px;
    }

    .card-wrapper {
        margin-left: -5px;
        margin-top: -20px;
    }

    footer {
        width: 100%;
        margin-top: 20px;
        display: flex;
        justify-content: center;
    }
`

const CardWrapper: React.FC<IndexedCard> = observer(({ card, index }) => {
    const { game } = useGame()

    const selected = React.useMemo(
        () =>
            includes(game.selected_indices, index)
                ? findIndex(game.selected_indices, (_) => _ === index)
                : undefined,
        [game.selected_indices, index],
    )

    const playable = React.useMemo(
        () => (!card ? false : includes(game.playable_cards, card)),
        [game.playable_cards, card],
    )

    const toggleCard = React.useCallback(() => {
        if (playable) {
            game.toggleCard(index as number)
            sound_manager.selectCard()
            return
        }

        game.clearSelection()
    }, [game, index, playable])

    const variants: Variants = React.useMemo(
        () => ({
            unplayable: {
                zIndex: 0,
                filter: 'brightness(0.35)',
                scale: 1,
                y: 0,
            },
            playable: {
                zIndex: 0,
                filter: 'brightness(1)',
                scale: 1,
                y: 0,
            },
            selected: {
                zIndex: selected !== undefined ? selected + 1 : 1,
                filter: 'brightness(1)',
                scale: 1.075,
                y: -10,
            },
        }),
        [selected],
    )

    const variant = React.useMemo(() => {
        if (!game.is_my_turn || game.game_over) {
            return 'unplayable'
        }

        if (selected !== undefined) {
            return 'selected'
        }

        if (index !== undefined) {
            return playable ? 'playable' : 'unplayable'
        }

        return 'default'
    }, [game.is_my_turn, playable, selected, index, game.game_over])

    return (
        <motion.div
            className="card-wrapper"
            transition={{ duration: 0.1 }}
            animate={variant}
            variants={variants}
            initial={'unplayable'}
        >
            <PlayingCard
                key={card.id}
                selected={selected}
                {...card}
                onClick={toggleCard}
            />
        </motion.div>
    )
})

export const PlayerCards: React.FC = observer(() => {
    const { game } = useGame()
    const active = game.is_my_turn && !game.game_over

    return (
        <Wrapper className={'self-area' + (active ? ' active' : '')}>
            <PlayerNameTag
                name={userState.user?.name as string}
                id={userState.user?.id as Player['id']}
            />
            <div className="cards">
                {game.indexed_cards.map(({ card, index }) => (
                    <CardWrapper key={index} card={card} index={index} />
                ))}
            </div>
            <footer style={{ display: 'none' }}>
                <button onClick={() => game.sortCards('value')}>
                    <span>Sort by value</span>
                </button>
                <button onClick={() => game.sortCards('type')}>
                    <span>Sort by type</span>
                </button>
            </footer>
        </Wrapper>
    )
})
