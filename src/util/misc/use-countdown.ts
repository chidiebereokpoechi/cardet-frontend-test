import { useEffect, useState } from 'react'
import { useTickTenGame } from './use-game'

let interval: number | undefined

const clearIntervalIfExists = () => {
    if (interval) {
        clearInterval(interval)
    }
}

export const useTickTenCountdown = () => {
    const { game } = useTickTenGame()
    const [countdown, setCountdown] = useState<number>(game.timeLeftInSeconds)

    useEffect(() => {
        interval = window.setInterval(() => {
            setCountdown((prev) => prev! - 1)

            if (countdown <= 0) {
                clearIntervalIfExists()
            }
        }, 1000)

        return () => {
            clearIntervalIfExists()
        }
    }, [])

    return [countdown]
}
