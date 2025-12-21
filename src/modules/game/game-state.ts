import { CardetGameState } from './cardet'
import { GameType } from './game-manager.state'

export type GameState =
    | {
          gameType: GameType.CARDET
          state: CardetGameState
      }
    | {
          gameType: GameType.TICK_TEN
          state: unknown
      }
