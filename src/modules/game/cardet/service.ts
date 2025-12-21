import { HttpClient } from '../../../util/api'
import { CardetGameState } from './types'
import { PlayModel } from './models'

class CardetService {
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
}

export const cardetService = new CardetService()
