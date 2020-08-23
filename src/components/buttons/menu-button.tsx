import { HTMLMotionProps, motion } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled(motion.button)`
  background: transparent;
  appearance: none;
  border: none;
  outline: none;
  display: inline-flex;
  width: 100%;
  padding: 0;
  margin: 0;
  cursor: pointer;

  .body {
    margin-left: 2rem;
    display: flex;
    height: 3rem;
    align-items: center;
    justify-content: flex-start;
    font-size: 1.25rem;
    font-weight: 600;
  }
`

const Circle = styled.div`
  height: 3rem;
  width: 3rem;
  border-radius: 100%;
  background: white;
`

type Props = HTMLMotionProps<'button'> & {
  color?: string
}

export const MenuButton: React.FC<Props> = ({
  children,
  color: _color,
  ...props
}) => {
  const backgroundColor = _color ?? 'white'

  return (
    <Wrapper {...props}>
      <Circle style={{ backgroundColor }} />
      <div className="body">{children}</div>
    </Wrapper>
  )
}
