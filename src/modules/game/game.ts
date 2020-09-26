import {
  concat,
  differenceBy,
  filter,
  find,
  first,
  forEach,
  includes,
  inRange,
  last,
  map,
  slice,
  sortBy,
  without,
} from 'lodash'
import { action, computed, observable } from 'mobx'
import { User, userState } from '../user'
import { Card, IndexedCard } from './card'
import { GameState } from './game-state.entity'
import { Player } from './player.entity'

const NUMBER_OF_CENTER_CARDS = 5

export class Game implements GameState {
  @observable
  public play_count: number

  @observable
  public id: string

  @observable
  public players: Player[]

  @observable
  public current_player_index: number

  @observable
  public played_cards: Card[]

  @observable
  public cards: Card[]

  @observable
  public indexed_cards: IndexedCard[]

  @observable
  public playable_cards_indices: number[]

  @observable
  public selected_indices: number[]

  @observable
  public market_count: number

  @observable
  public game_over: boolean

  @observable
  public game_winner: Player | null

  @computed
  public get self() {
    const user = userState.user as User
    return find(this.players, user) as Player
  }

  @computed
  public get current_player() {
    return this.players[this.current_player_index]
  }

  @computed
  public get other_players() {
    const user = userState.user as User
    return filter(this.players, (_user) => _user.id !== user.id)
  }

  @computed
  public get center_cards() {
    return slice(this.played_cards, -1 * NUMBER_OF_CENTER_CARDS)
  }

  @computed
  public get center_card() {
    return last(this.played_cards) as Card
  }

  @computed
  public get is_my_turn() {
    const user = userState.user as User
    return this.current_player.id === user.id
  }

  @computed
  public get selected_cards() {
    return map(this.selected_indices, (index) => this.cards[index])
  }

  @computed
  public get playable_cards(): Card[] {
    if (this.selected_indices.length > 0) {
      return filter(this.cards, (card) =>
        Card.canStack([...this.selected_cards, card]),
      )
    }

    return map(this.playable_cards_indices, (index) => this.cards[index])
  }

  @computed
  public get can_play(): boolean {
    return (
      this.is_my_turn &&
      includes(this.playable_cards_indices, first(this.selected_indices)) &&
      Card.canStack(this.selected_cards)
    )
  }

  private constructor(state: GameState) {
    this.play_count = state.play_count
    this.id = state.id
    this.players = state.players
    this.current_player_index = state.current_player_index
    this.played_cards = state.played_cards
    this.cards = state.cards
    this.indexed_cards = Game.getIndexedCards(this.cards)
    this.playable_cards_indices = state.playable_cards_indices
    this.selected_indices = []
    this.market_count = state.market_count
    this.game_over = state.game_over
    this.game_winner = state.game_winner
  }

  @action
  public toggleCard(index: number) {
    if (!inRange(index, 0, this.cards.length)) {
      throw new Error('Invalid card selection')
    }

    if (!includes(this.selected_indices, index)) {
      this.selected_indices = concat(this.selected_indices, index)
    } else {
      this.selected_indices = without(this.selected_indices, index)
    }

    if (!this.can_play) this.clearSelection()
  }

  @action
  public selectCards(...indices: number[]) {
    forEach(indices, (index) => this.toggleCard(index))
  }

  @action
  public sortCards(by: keyof Card) {
    this.indexed_cards = sortBy(this.indexed_cards, ({ card }) => card[by])
  }

  @action
  public clearSelection() {
    this.selected_indices = []
  }

  @action
  public update(state: GameState) {
    if (this.play_count === state.play_count) {
      return this
    }

    if (this.cards.length !== state.cards.length) {
      this.cards = map(state.cards, (card) => {
        return find(this.cards, card) ?? card
      })

      const all_indexed = Game.getIndexedCards(this.cards)
      const extra_cards = differenceBy(
        all_indexed,
        this.indexed_cards,
        'card.id',
      )

      const indexed_without_played = filter(
        this.indexed_cards,
        ({ card }) => !!find(this.cards, card),
      )

      this.indexed_cards = indexed_without_played.concat(extra_cards)

      forEach(this.indexed_cards, (card) => {
        const { index } = find(all_indexed, { card: card.card }) as IndexedCard
        card.index = index
      })
    }

    this.clearSelection()
    this.current_player_index = state.current_player_index
    this.players = state.players
    this.played_cards = state.played_cards
    this.playable_cards_indices = state.playable_cards_indices
    this.market_count = state.market_count
    this.game_over = state.game_over
    this.game_winner = state.game_winner
    return this
  }

  public static getIndexedCards(cards: Card[]): IndexedCard[] {
    return map(cards, (card, index) => ({ card, index }))
  }

  public static create(state: GameState) {
    return new Game(state)
  }
}
