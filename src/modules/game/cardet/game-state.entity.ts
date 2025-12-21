import { Card } from './card'
import { Player } from './player.entity'

export interface CardetGameState {
    play_count: number
    id: string
    players: Player[]
    current_player_index: number
    played_cards: Card[]
    cards: Card[]
    playable_cards_indices: number[]
    market_count: number
    game_over: boolean
    game_winner: Player | null
}
