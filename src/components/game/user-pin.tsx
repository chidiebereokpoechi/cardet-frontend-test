import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: inline-grid;
  grid-template-columns: 2rem 1fr;
  width: 18rem;
  gap: 1rem;

  .name-section {
    display: flex;
    align-items: center;
    padding-right: 3rem;
  }
`

const PictureCircle = styled.div`
  background: #f8c94f;
  height: 2rem;
  width: 2rem;
  border-radius: 100%;
`

interface Props {
  name: string
}

export const UserPin: React.FC<Props> = ({ name }) => {
  return (
    <Wrapper>
      <PictureCircle />
      <div className="name-section">
        <b>{name}</b>
      </div>
    </Wrapper>
  )
}
