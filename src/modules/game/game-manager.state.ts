import { once } from 'lodash'
import { action, observable } from 'mobx'
import { Subscription } from 'rxjs'
import { sound_manager } from '../../util'
import { Room, roomState } from '../rooms'
import { Game } from './game'
import { gameManagerService } from './game-manager.service'
import { GameState } from './game-state.entity'

let sub: Subscription | null = null

class GameManagerState {
  @observable
  public game: Game | null = null

  @observable
  public menu_open = false

  @observable
  public loading_game = false

  @observable
  public loading_move = false

  public last_responded_count = 0

  private constructor() {
    setInterval(() => {
      if (!sub || sub?.closed) this.getGameState()
    }, 5000)
  }

  public respond(state: GameState) {
    const game = this.game

    if (!game) {
      return
    }

    if (this.last_responded_count >= state.play_count) {
      return
    }

    const pick_count = state.cards.length - game.cards.length
    this.last_responded_count = state.play_count

    if (pick_count === 1) {
      sound_manager.pickCards()
      return
    }

    if (pick_count < 1) {
      sound_manager.selectCard()
      return
    }

    if (pick_count > 1) {
      sound_manager.punch()
      return
    }
  }

  @action
  public openMenu() {
    this.menu_open = true
  }

  @action
  public closeMenu() {
    this.menu_open = false
  }

  @action
  public getGameState() {
    const room = roomState.room
    if (!room) return

    sub?.unsubscribe()

    sub = gameManagerService.getGameState(room.game_manager_id).subscribe({
      next: (response) => {
        if (response.data) {
          this.respond(response.data)
          this.game = this.game
            ? this.game.update(response.data)
            : Game.create(response.data)
          return
        }

        this.game = null
      },
    })

    return sub
  }

  @action
  public pick() {
    const room = roomState.room as Room
    const game = this.game as Game

    if (!game.is_my_turn) return
    if (game.selected_indices.length !== 0) {
      return game.clearSelection()
    }

    return gameManagerService.pick(room.game_manager_id).subscribe({
      next: (response) => {
        if (response.data) {
          roomState.gateway.play()
          this.respond(response.data)
          this.game = this.game
            ? this.game.update(response.data)
            : Game.create(response.data)
          return
        }

        this.game = null
      },
    })
  }

  @action
  public play() {
    const room = roomState.room as Room
    const game = this.game as Game

    if (!game.is_my_turn) return
    if (game.selected_indices.length === 0) return

    return gameManagerService
      .play(room.game_manager_id, { indices: game.selected_indices })
      .subscribe({
        next: (response) => {
          roomState.gateway.play()
          if (response.data) {
            this.respond(response.data)
            this.game = this.game
              ? this.game.update(response.data)
              : Game.create(response.data)
            return
          }

          this.game = null
        },
      })
  }

  @action
  public startGame() {
    if (this.game) return
    const room = roomState.room as Room

    return gameManagerService.startGame(room.game_manager_id).subscribe({
      next: (response) => {
        if (response.data) {
          this.game = Game.create(response.data)
          roomState.gateway.startGame()
        }
      },
    })
  }

  @action
  public endGame() {
    if (!this.game) return
    const room = roomState.room as Room

    return gameManagerService.endGame(room.game_manager_id).subscribe({
      next: (response) => {
        if (response.ok) {
          this.game = null
          roomState.gateway.endGame()
        }
      },
    })
  }

  public static create = once(() => new GameManagerState())
}

export const gameManagerState = GameManagerState.create()
