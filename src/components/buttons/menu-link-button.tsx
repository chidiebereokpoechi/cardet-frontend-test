import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled(Link)`
  background: transparent;
  appearance: none;
  border: none;
  outline: none;
  display: inline-flex;
  width: 100%;
  padding: 0;
  margin: 0;

  .body {
    margin-left: 2rem;
    display: flex;
    height: 3rem;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const Circle = styled.div`
  height: 3rem;
  width: 3rem;
  border-radius: 1rem;
  background: white;
`;

type Props = {
  to: string;
  color?: string;
};

export const MenuLinkButton: React.FC<Props> = ({
  children,
  color: _color,
  ...props
}) => {
  const backgroundColor = _color ?? "white";

  return (
    <Wrapper {...props}>
      <Circle style={{ backgroundColor }} />
      <div className="body">{children}</div>
    </Wrapper>
  );
};
