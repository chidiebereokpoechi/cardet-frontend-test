import styled from 'styled-components'

export const MenuPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  header {
    padding: 2rem;
    font-size: 2.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
  }

  main {
    flex: 1;
    padding: 0 2rem;
    display: flex;
  }

  footer {
    display: flex;
    padding: 2rem;
    justify-content: center;
  }
`
