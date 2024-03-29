import React from "react";
import { ArrowLeft } from "react-feather";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Button = styled(Link)`
  display: flex;
  background: white;
  height: 3rem;
  width: 3rem;
  border: none;
  outline: none;
  margin-right: 2rem;
  --color: black;
  color: var(--color);
  border-radius: 1rem;
  align-items: center;
  justify-content: center;
`;

export const BackButton: React.FC<{ to: string }> = (props) => {
  return (
    <Button {...props}>
      <ArrowLeft />
    </Button>
  );
};
