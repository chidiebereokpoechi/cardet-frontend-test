import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled(motion.button)`
  display: flex;
  background: white;
  height: 3rem;
  padding: 0 2rem;
  border: none;
  outline: none;
  --color: black;
  color: var(--color);
  border-radius: 1.5rem;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
`

type Props = HTMLMotionProps<'button'>

export const Button: React.FC<Props> = (props) => {
  return <Wrapper {...props} />
}
