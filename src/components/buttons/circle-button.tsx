import { motion } from 'framer-motion'
import styled from 'styled-components'

export const CircleButton = styled(motion.button)`
  background: linear-gradient(#fbffff, #d2d3d1);
  color: black;
  border-radius: 100%;
  border: none;
  outline: none;
  height: 3rem;
  width: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
