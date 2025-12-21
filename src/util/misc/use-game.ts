import { CardetGame } from '../../modules/game/cardet'
import { gameManager } from '../../modules/game/game-manager'
import { TickTenGame } from '../../modules/game/tick-ten/game'

export const useCardetGame = () => {
    const game = gameManager.cardetGame as CardetGame
    return { manager: gameManager, game }
}

export const useTickTenGame = () => {
    const game = gameManager.tickTenGame as TickTenGame

    return { manager: gameManager, game }
}
