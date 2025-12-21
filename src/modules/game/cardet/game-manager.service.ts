import { HttpClient } from '../../../util/api'
import { CardetGameState } from './game-state.entity'
import { PlayModel } from './models'

class GameManagerService {
    public play(id: string, model: PlayModel) {
        return HttpClient.post<PlayModel, CardetGameState>(
            `cardet/${id}/play`,
            model,
            false,
        )
    }

    public pick(id: string) {
        return HttpClient.post<never, CardetGameState>(
            `cardet/${id}/pick`,
            undefined,
            false,
        )
    }

    public sort(id: string) {
        return HttpClient.post<never, CardetGameState>(
            `cardet/${id}/sort`,
            undefined,
            false,
        )
    }

    public startGame(id: string) {
        return HttpClient.post<never, unknown>(`rooms/${id}`, undefined, false)
    }

    public endGame(id: string) {
        return HttpClient.delete<CardetGameState>(`game-managers/${id}`, false)
    }
}

export const gameManagerService = new GameManagerService()
