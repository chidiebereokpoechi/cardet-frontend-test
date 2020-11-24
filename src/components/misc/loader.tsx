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

const OverflowWrapper = styled(Wrapper)`
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
    <OverflowWrapper>
      <div className="spinner-border spinner-border-sm" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </OverflowWrapper>
  )
}
