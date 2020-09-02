import styled from 'styled-components'

export const GamePageWrapper = styled.div`
  background: #0f523d;
  height: 100%;
  width: 100%;
  color: #fbffff;
  display: flex;
  flex-direction: column;

  header {
    padding: 1rem;
    display: flex;
    width: 100%;
    /* position: absolute; */
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
  }

  .players-area {
    /* background: blue; */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
    gap: 1rem;
  }

  .center-area {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;

    > * + * {
      margin-left: 2rem;
    }
  }

  .room-code {
    color: black;
    font-size: 1.5rem;
    font-weight: bold;
  }
`
