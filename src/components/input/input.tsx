import styled from 'styled-components'

export const Input = styled.input`
  height: 4rem;
  width: 100%;
  border-radius: 2rem;
  background: #252f33;
  border: none;
  font-weight: bold;
  text-align: center;
  font-size: 2rem;
  color: inherit;
  letter-spacing: 5px;
  text-transform: uppercase;
  user-select: text;

  ::placeholder {
    color: #cad4de;
    letter-spacing: unset;
  }
`
