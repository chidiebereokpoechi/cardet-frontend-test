import React from 'react'
import styled from 'styled-components'
import { User } from '../../modules/user'

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
  background: #1a1c1f;
  height: 2rem;
  width: 2rem;
  border-radius: 100%;
`

type Props = User

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
