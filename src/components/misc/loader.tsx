import { motion, MotionProps } from 'framer-motion'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 2rem;
    width: 100%;
    font-size: 2rem;
    font-weight: 700 !important;
`

const OverflowWrapper = styled(Wrapper)<MotionProps>`
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    height: var(--vh);
    width: var(--vw);
`

export const Loader = () => {
    return (
        <Wrapper>
            <span>Tinkering...</span>
        </Wrapper>
    )
}

export const LoaderOverlay = () => {
    return (
        <OverflowWrapper
            as={motion.div}
            initial={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            animate={{ opacity: 1 }}
        >
            <div className="spinner-border spinner-border-xl" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </OverflowWrapper>
    )
}
