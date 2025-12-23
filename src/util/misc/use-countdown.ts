import { useEffect, useState } from 'react'
import { useTickTenGame } from './use-game'
import { sound_manager } from '../sound'
import useSound from 'use-sound'
import { GameStatus } from '../../modules/game/tick-ten'

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
            setCountdown((prev) => {
                const newCount = prev! - 1

                if (game.status === GameStatus.COUNTDOWN) {
                    if (newCount < 4) {
                        sound_manager.tickFast()
                    } else if (newCount < 10) {
                        sound_manager.tickMed()
                    } else {
                        sound_manager.tickNormal()
                    }
                }

                return newCount
            })

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
