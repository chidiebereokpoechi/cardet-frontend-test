import { HttpClient } from '../../util/api'
import { GameState } from './game-state.entity'
import { PlayModel } from './models'

class GameManagerService {
  public getGameState(id: string) {
    return HttpClient.get<GameState>(`game-managers/${id}`)
  }

  public play(id: string, model: PlayModel) {
    return HttpClient.post<PlayModel, GameState>(
      `game-managers/${id}/play`,
      model
    )
  }

  public pick(id: string) {
    return HttpClient.post<never, GameState>(`game-managers/${id}/pick`)
  }

  public sort(id: string) {
    return HttpClient.post<never, GameState>(`game-managers/${id}/sort`)
  }

  public startGame(id: string) {
    return HttpClient.post<never, GameState>(`game-managers/${id}`)
  }

  public endGame(id: string) {
    return HttpClient.delete<GameState>(`game-managers/${id}`)
  }
}

export const gameManagerService = new GameManagerService()
