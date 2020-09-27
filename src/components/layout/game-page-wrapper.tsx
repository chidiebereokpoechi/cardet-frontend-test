import styled from 'styled-components'

export const GamePageWrapper = styled.div`
  background: #142025;
  height: 100%;
  width: 100%;
  color: #fbffff;
  display: flex;
  flex-direction: column;

  header {
    padding: 1rem 2rem;
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

    .center-card {
      width: var(--card-width);
      margin-left: 20px;
    }
  }

  .room-code {
    color: black;
    font-size: 1.5rem;
    font-weight: bold;
  }
`
