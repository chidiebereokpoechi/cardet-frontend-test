import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: inline-grid;
    grid-template-columns: 2rem 1fr;
    width: 100%;
    gap: 1rem;

    .name-section {
        display: flex;
        align-items: center;
        font-weight: bold;
    }

    .you {
        color: var(--primary);
    }

    .you-indicator {
        margin-left: 0.5rem;
    }
`

const PictureCircle = styled.div`
    background: url(/logo.png);
    height: 2rem;
    width: 2rem;
    background-size: contain;
    background-repeat: no-repeat;
    border-radius: 1rem;
`

interface Props {
    name: string
    you: boolean
}

export const UserPin: React.FC<Props> = ({ name, you }) => {
    return (
        <Wrapper>
            <PictureCircle />
            <div className="name-section">
                <span className={you ? 'you' : undefined}>{name}</span>
                {you && <b className="you-indicator">🧍🏾‍♂️</b>}
            </div>
        </Wrapper>
    )
}
