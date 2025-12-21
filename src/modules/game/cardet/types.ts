import { User } from '../../user'
import { Card, SerializedCard } from './card'

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

export interface Player extends User {
    cards: SerializedCard[]
}
