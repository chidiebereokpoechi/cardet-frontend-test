import styled from 'styled-components'

export const MenuPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  header {
    padding: 2rem;
    font-size: 3rem;
    font-weight: 600;
    display: flex;
    align-items: center;
  }

  main {
    flex: 1;
    padding: 2rem;
    display: flex;
  }

  footer {
    padding: 2rem;
  }
`
