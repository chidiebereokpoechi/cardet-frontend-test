import { once } from 'lodash'
import { action, observable } from 'mobx'
import { Subscription } from 'rxjs'
import { sound_manager } from '../../util'
import { Room, roomsService, roomState } from '../rooms'
import { CardetGame } from './cardet/game'
import { cardetService } from './cardet/service'
import { CardetGameState } from './cardet/types'

let sub: Subscription | null = null

export enum GameType {
    CARDET = 'CARDET',
    TICK_TEN = 'TICK_TEN',
}

class GameManager {
    @observable
    public cardetGame: CardetGame | null = null

    @observable
    public tickTenGame: unknown | null = null

    @observable
    public menu_open = false

    @observable
    public loading_game = false

    @observable
    public loading_move = false

    public last_responded_count = 0

    private constructor() {}

    public respond(state: CardetGameState) {
        const game = this.cardetGame

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

        sub = roomsService.getGameState().subscribe({
            next: (response) => {
                if (!response.data.state) {
                    this.cardetGame = null
                    this.tickTenGame = null
                    return
                }

                switch (response.data.gameType) {
                    case GameType.CARDET:
                        this.respond(response.data.state)
                        this.cardetGame = this.cardetGame
                            ? this.cardetGame.update(response.data.state)
                            : CardetGame.create(response.data.state)
                        return
                    case GameType.TICK_TEN:
                        this.tickTenGame = response.data.state
                        return
                }
            },
        })

        return sub
    }

    @action
    public pick() {
        const room = roomState.room as Room
        const game = this.cardetGame as CardetGame

        if (!game.is_my_turn) return
        if (game.selected_indices.length !== 0) {
            return game.clearSelection()
        }

        return cardetService.pick(room.game_manager_id).subscribe({
            next: (response) => {
                if (response.data) {
                    roomState.gateway.play()
                    this.respond(response.data)
                    this.cardetGame = this.cardetGame
                        ? this.cardetGame.update(response.data)
                        : CardetGame.create(response.data)
                    return
                }

                this.cardetGame = null
            },
        })
    }

    @action
    public play() {
        const room = roomState.room as Room
        const game = this.cardetGame as CardetGame

        if (!game.is_my_turn) return
        if (game.selected_indices.length === 0) return

        return cardetService
            .play(room.game_manager_id, { indices: game.selected_indices })
            .subscribe({
                next: (response) => {
                    roomState.gateway.play()
                    if (response.data) {
                        this.respond(response.data)
                        this.cardetGame = this.cardetGame
                            ? this.cardetGame.update(response.data)
                            : CardetGame.create(response.data)
                        return
                    }

                    this.cardetGame = null
                },
            })
    }

    @action
    public startGame(game_type: GameType) {
        if (this.cardetGame) return
        const room = roomState.room as Room

        return roomsService.startGame(game_type).subscribe({
            next: (response) => {
                if (response.data) {
                    this.getGameState()
                    roomState.gateway.startGame()
                }
            },
        })
    }

    @action
    public endGame() {
        if (!this.cardetGame && !this.tickTenGame) return
        const room = roomState.room as Room

        return roomsService.endGame().subscribe({
            next: (response) => {
                if (response.ok) {
                    this.cardetGame = null
                    this.tickTenGame = null

                    roomState.gateway.endGame()
                }
            },
        })
    }

    public static create = once(() => new GameManager())
}

export const gameManager = GameManager.create()
