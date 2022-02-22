import styled from "styled-components";

export const MenuPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;

  header {
    font-family: Gilroy, sans-serif;
    color: var(--primary);
    background: #121518;
    padding: 1.75rem;
    font-size: 2.5rem;
    line-height: 2.5rem;
    font-weight: 700;
    display: flex;
    align-items: center;
  }

  header .logo {
    width: 3rem;
  }

  main {
    flex: 1;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: 700 !important;
  }

  footer {
    background: #121518;
    display: flex;
    padding: 1.75rem;
    justify-content: center;

    > * + * {
      margin-left: 1rem;
    }
  }
`;
