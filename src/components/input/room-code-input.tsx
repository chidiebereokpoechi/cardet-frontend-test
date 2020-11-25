import { useField } from 'formik'
import { motion } from 'framer-motion'
import { range } from 'lodash'
import React from 'react'
import styled from 'styled-components'

const Blinker = styled(motion.div)`
  --blue: #a0d5ff;
  background: var(--blue);
  height: 1.75rem;
  width: 0.25rem;
  animation: blink 0.8s infinite;
  opacity: 0;

  @keyframes blink {
    0% {
      background: #222;
    }
    50% {
      background: var(--blue);
    }
    100% {
      background: #222;
    }
  }
`

const BoxWrapper = styled(motion.div)`
  background: #3c474c;
  border-radius: 0.5rem;
  height: 4rem;
  width: 100%;
  display: flex;
  place-items: center;
  place-content: center;
  color: black;
  font-weight: bold;
  font-size: 1.5rem;
  text-transform: uppercase;
  transition: 0.2s;

  span {
    transform: translateY(5px);
  }

  &.filled {
    background: #919799;
    color: #2c3b42;
  }
`

interface BoxProps {
  value: string
  index: number
}

const InputBox: React.FC<BoxProps> = ({ value, index }) => {
  const filled = !!value[index]

  return (
    <BoxWrapper className={filled ? 'filled' : ''}>
      {value[index] && <span>{value[index]}</span>}
      {value.length === index && <Blinker layoutId="blinker" />}
    </BoxWrapper>
  )
}

const ROOM_CODE_FIELD_NAME = 'room_id'
const ROOM_CODE_LENGTH = 4

const InputWrapper = styled(motion.div)`
  background: #252f33;
  padding: 1rem;
  position: relative;
  display: grid;
  grid-template-columns: repeat(${ROOM_CODE_LENGTH}, 1fr);
  gap: 1rem;
  border-radius: 1rem;
  place-items: center;
  place-content: center;

  .message {
    font-weight: 700;
    color: #a0d5ff;
    font-size: 1rem;
    grid-column: span 4;
    text-align: center;
  }

  .input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    height: 100%;
    width: 100%;
    user-select: text;
    z-index: 1;
  }

  :focus-within {
    ${Blinker} {
      opacity: 1;
    }
  }
`

export const RoomCodeInput = () => {
  const [field, meta, helpers] = useField({ name: ROOM_CODE_FIELD_NAME })
  return (
    <div>
      <span className="d-flex mb-3 text-align-center">
        Enter the room code below
      </span>
      <InputWrapper>
        <input
          className="input"
          maxLength={ROOM_CODE_LENGTH}
          onInput={(e) => {
            const value = e.currentTarget.value.slice(0, 4)
            helpers.setValue(value)
          }}
        />
        {range(0, ROOM_CODE_LENGTH).map((index) => (
          <InputBox value={field.value} index={index} key={index} />
        ))}
        {meta.error && (
          <motion.span layoutId="" className="d-flex mt-3 message">
            {meta.error}
          </motion.span>
        )}
      </InputWrapper>
    </div>
  )
}
