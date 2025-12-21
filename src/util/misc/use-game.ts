import { Game } from '../../modules/game/cardet'
import { gameManagerState } from '../../modules/game/game-manager.state'

export const useCardetGame = () => {
    const game = gameManagerState.cardetGame as Game
    return { manager: gameManagerState, game }
}

export const useTickTenGame = () => {
    const game = gameManagerState.tickTenGame
    return { manager: gameManagerState, game }
}
