import { Game, gameManagerState } from '../../modules/game'

export const useGame = () => {
  const game = gameManagerState.game as Game
  return { manager: gameManagerState, game }
}
