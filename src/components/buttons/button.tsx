import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled(motion.button)`
  background: blue;
`

type Props = HTMLMotionProps<'button'>

export const Button: React.FC<Props> = (props) => {
  return <Wrapper {...props} />
}
