import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'
import { CircleButton } from './circle-button'
import { classNames } from '../../util'

const Wrapper = styled(motion.button)`
    background: transparent;
    appearance: none;
    border: none;
    outline: none;
    display: inline-flex;
    color: inherit;
    width: 100%;
    padding: 0;
    margin: 0;
    cursor: pointer;

    .body {
        margin-left: 2rem;
        display: flex;
        height: 3rem;
        align-items: center;
        justify-content: flex-start;
        font-size: 1.25rem;
        font-weight: 700;
        stroke-width: 2px;
    }

    svg {
        color: white;
        size: 24px;
    }

    :disabled {
        cursor: not-allowed;

        ${CircleButton} {
            background: var(--understated-grey) !important;
            color: var(--dark-grey) !important;
        }

        .body {
            color: var(--understated-grey) !important;
        }
    }
`

type Props = HTMLMotionProps<'button'> & {
    color?: string
    icon?: React.ComponentType
    innerText?: string | number
    innerTextColor?: string
}

export const MenuButton: React.FC<Props> = ({
    children,
    color: _color,
    icon: Icon,
    innerText,
    innerTextColor,
    ...props
}) => {
    const backgroundColor = _color

    return (
        <Wrapper {...props}>
            <CircleButton style={{ backgroundColor }} as={motion.div}>
                {Icon && <Icon />}
                {innerText && (
                    <span
                        className="text-lg font-bold"
                        style={{ color: innerTextColor }}
                    >
                        {innerText}
                    </span>
                )}
            </CircleButton>
            <div className="body">{children}</div>
        </Wrapper>
    )
}
