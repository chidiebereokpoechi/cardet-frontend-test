import { observer } from 'mobx-react'
import React from 'react'
import styled from 'styled-components'
import { useGame } from '../../../util'
import { PlayerDeck } from './player-deck'

const Wrapper = styled.div`
    display: flex;
    place-content: center;
    place-items: center;
`

export const PlayersArea: React.FC = observer(() => {
    const {
        game: { other_players: players },
    } = useGame()

    return (
        <Wrapper className="players-area">
            {players.map((player) => (
                <PlayerDeck key={player.id} player={player} />
            ))}
        </Wrapper>
    )
})
