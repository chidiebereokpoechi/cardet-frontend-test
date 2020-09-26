import { once } from 'lodash'
import { action, observable } from 'mobx'
import { Room, roomState } from '../rooms'
import { Game } from './game'
import { gameManagerService } from './game-manager.service'

class GameManagerState {
  @observable
  public game: Game | null = null

  private constructor() {}

  @action
  public getGameState() {
    const room = roomState.room as Room
    return gameManagerService.getGameState(room.game_manager_id).subscribe({
      next: (response) => {
        if (response.data) {
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
  public pick() {
    const room = roomState.room as Room
    const game = this.game as Game
    if (!game.is_my_turn) return
    return gameManagerService.pick(room.game_manager_id).subscribe({
      next: (response) => {
        if (response.data) {
          roomState.gateway.play()
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
