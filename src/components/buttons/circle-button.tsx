import { motion } from "framer-motion";
import styled from "styled-components";

export const CircleButton = styled(motion.button)`
  background: white;
  color: black;
  border-radius: 1rem;
  border: none;
  outline: none;
  height: 3rem !important;
  width: 3rem !important;
  appearance: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
