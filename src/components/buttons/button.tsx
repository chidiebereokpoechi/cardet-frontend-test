import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled(motion.button)`
    display: flex;
    background: var(--button-background);
    height: var(--button-height);
    padding: 0 2rem;
    border: none;
    outline: none;
    color: var(--button-color);
    border-radius: 1rem;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    cursor: pointer;
`

type Props = HTMLMotionProps<'button'>

export const Button: React.FC<Props> = (props) => {
    return <Wrapper {...props} />
}
