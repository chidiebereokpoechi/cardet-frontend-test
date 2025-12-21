import { CardetGameState } from './cardet'
import { GameType } from './game-manager'
import { TickTenGameState } from './tick-ten'

export type GameState =
    | {
          gameType: GameType.CARDET
          state: CardetGameState
      }
    | {
          gameType: GameType.TICK_TEN
          state: TickTenGameState
      }
