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
        color: var(--primary);
    }
`

const PictureCircle = styled.div`
    background: url(/logo.png);
    height: 2rem;
    width: 2rem;
    background-size: contain;
    background-repeat: no-repeat;
    border-radius: 0.75rem;
`

interface Props {
    name: string
    you: boolean
    isAdmin: boolean
}

export const UserPin: React.FC<Props> = ({ name, you, isAdmin }) => {
    return (
        <Wrapper>
            <PictureCircle />
            <div className="name-section">
                <span className={you ? 'you' : undefined}>{name}</span>
                {isAdmin && (
                    <b className="text-[.5rem] you-indicator">(Admin)</b>
                )}
            </div>
        </Wrapper>
    )
}
