import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled(motion.button)`
  display: flex;
  background: white;
  height: 2rem;
  padding: 0 2rem;
  border: none;
  outline: none;
  margin-right: 2rem;
  color: black;
  border-radius: 1rem;
  align-items: center;
  justify-content: center;
`

type Props = HTMLMotionProps<'button'>

export const Button: React.FC<Props> = (props) => {
  return <Wrapper {...props} />
}
