import styled from "styled-components";
import { MenuPageWrapper } from "./menu-page-wrapper";

export const GamePageWrapper = styled(MenuPageWrapper)`
  background: #142025;
  height: 100%;
  width: 100%;
  color: #fbffff;
  display: flex;
  flex-direction: column;

  > main {
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
`;
