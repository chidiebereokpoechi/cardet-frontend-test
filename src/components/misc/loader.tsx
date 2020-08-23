import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`

export const Loader = () => {
  return (
    <Wrapper>
      <h1>Loading</h1>
    </Wrapper>
  )
}
