import { motion } from 'framer-motion'
import { observer } from 'mobx-react'
import React from 'react'
import { GiQueenCrown } from 'react-icons/gi'
import { ImArrowRight2 } from 'react-icons/im'
import styled from 'styled-components'
import { Player } from '../../../modules/game/cardet'
import { useCardetGame } from '../../../util'

const Wrapper = styled(motion.div)`
    transition: 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
    font-size: 80%;
    transition: 0.2s;

    main {
        display: flex;
        padding: 5px 10px;
        background: transparent;
        flex-direction: row;
        align-items: center;
    }

    .winner {
        --yellow: #ebb400;
        color: var(--yellow);
        text-shadow: 0 0 10px var(--yellow);
    }

    &.active main {
        background: rgba(0, 0, 0, 0.45);
        color: var(--green);
        text-shadow: 0 0 5px var(--green);
    }
`

interface Props {
    name: string
    id: Player['id']
}

const TurnIndicator: React.FC = () => {
    return (
        <motion.div
            // Remove layoutId if it's not essential for your layout animations
            animate={{
                x: [-2, 4, -2], // Three keyframes for smooth ping-pong
            }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                loop: Infinity,
            }}
            style={{ color: 'white', marginRight: 10 }}
        >
            <ImArrowRight2 />
        </motion.div>
    )
}

export const PlayerNameTag: React.FC<Props> = observer(({ id, name }) => {
    const { game } = useCardetGame()
    const active = !game.game_over && game.current_player.id === id
    const winner = game.game_winner?.id === id

    return (
        <Wrapper className={active ? 'active' : ''}>
            {winner && (
                <div className="winner" style={{ marginBottom: 10 }}>
                    <GiQueenCrown size={20} />
                </div>
            )}
            <main>
                {active && <TurnIndicator />}
                <span className={winner ? 'winner' : ''}>{name}</span>
            </main>
        </Wrapper>
    )
})
