import React from 'react'
import styled from 'styled-components'
import { ping } from '../../util/api/http/ping'

export const Wrapper = styled.div`
    position: fixed;
    top: 0.5rem;
    left: 1.75rem;
    font-size: 0.5rem;
    font-weight: bold;
    font-family: monospace;
    transition: opacity 0.3s ease;
`

export const PingMeter = () => {
    const [latency, setLatency] = React.useState<number | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const animationRef = React.useRef<number>()
    const lastUpdateRef = React.useRef(0)
    const mountedRef = React.useRef(true)

    const color = React.useMemo(() => {
        if (latency === null) return 'gray'
        if (latency < 100) return 'var(--good)'
        if (latency < 300) return 'var(--medium)'
        if (latency < 600) return 'var(--warning)'
        return 'var(--critical)'
    }, [latency])

    const checkPing = React.useCallback(async () => {
        if (!mountedRef.current) return

        try {
            setIsLoading(true)
            const result = await ping()
            if (mountedRef.current) {
                setLatency(result)
                lastUpdateRef.current = performance.now()
            }
        } catch (error) {
            console.error('Ping check failed:', error)
            if (mountedRef.current) setLatency(Infinity)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const loop = React.useCallback(
        (timestamp: number) => {
            if (!mountedRef.current) return

            // Debounce check: only ping if 2 seconds have passed since last update
            if (timestamp - lastUpdateRef.current >= 2000000000) {
                checkPing()
            }

            animationRef.current = requestAnimationFrame(loop)
        },
        [checkPing],
    )

    React.useEffect(() => {
        mountedRef.current = true
        animationRef.current = requestAnimationFrame(loop)

        return () => {
            mountedRef.current = false
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [loop])

    return (
        <Wrapper style={{ opacity: isLoading ? 0.5 : 1 }}>
            <span style={{ color }}>
                {latency === null
                    ? '...'
                    : latency === Infinity
                    ? 'OFFLINE'
                    : `${Math.round(latency)} ms`}
            </span>
        </Wrapper>
    )
}
