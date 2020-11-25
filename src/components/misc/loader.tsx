import { motion, MotionProps } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
  width: 100%;
`

const OverflowWrapper = styled(Wrapper)<MotionProps>`
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  z-index: 9999;
  position: fixed;
  top: 0;
  left: 0;
  height: var(--vh);
  width: var(--vw);
`

export const Loader = () => {
  return (
    <Wrapper>
      <h1>Preparing the game</h1>
    </Wrapper>
  )
}

export const LoaderOverlay = () => {
  return (
    <OverflowWrapper
      as={motion.div}
      initial={{ opacity: 0 }}
      transition={{ duration: 1.25, delay: 0.25 }}
      animate={{ opacity: 1 }}
    >
      <div className="spinner-border spinner-border-xl" role="status">
        <h1 className="sr-only">Loading...</h1>
      </div>
    </OverflowWrapper>
  )
}
