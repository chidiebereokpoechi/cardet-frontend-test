import { motion } from 'framer-motion'
import styled from 'styled-components'

export const CircleButton = styled(motion.button)`
    background: white;
    color: #2b2e33;
    border-radius: 1rem;
    border: none;
    outline: none;
    height: var(--button-height) !important;
    width: var(--button-height) !important;
    appearance: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`
