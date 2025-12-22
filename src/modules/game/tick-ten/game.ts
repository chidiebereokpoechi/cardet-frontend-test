import { action, computed, observable } from 'mobx'
import {
    Category,
    GameStatus,
    Letter,
    Player,
    PlayerSheet,
    SubmissionToGrade,
    TickTenGameState,
    Turn,
} from './types'
import { GradeSubmissionModel, RecordAnswerModel } from './models'
import { tickTenService } from './service'
import { roomState } from '../../rooms'

export class TickTenGame implements TickTenGameState {
    @observable
    id: string

    @observable
    me: Player

    @observable
    players: Player[]

    @observable
    letters: Letter[]

    @observable
    categories: Category[]

    @observable
    turn: Turn

    @observable
    status: GameStatus

    @observable
    playerSheet: PlayerSheet

    @observable
    leaderboard: Record<string, number>

    @observable
    submissionToGrade?: SubmissionToGrade

    countdownTimeout?: number

    @observable
    countdownTimeLeftInSeconds?: number

    @computed
    public get haveISubmitted(): boolean {
        return this.turn.submissions.some((s) => s.player.id === this.me.id)
    }

    @computed
    public get haveIGraded(): boolean {
        return this.turn.gradedSubmissions.some(
            (player) => player.id === this.submissionToGrade?.player.id,
        )
    }

    @computed
    public get countdownStartTime(): number | undefined {
        if (this.turn.submissions.length === 0) return undefined

        return this.turn.submissions[0]?.timestamp
    }

    @computed
    public get countdownEndTime(): number | undefined {
        if (!this.countdownStartTime) return undefined

        return (
            this.countdownStartTime +
            roomState.room!.game_config.tickTenGameConfig.countdownInSeconds *
                1000
        )
    }

    @computed
    public get timeLeftInSeconds(): number {
        if (!this.countdownEndTime) return 0

        const diffInMs = this.countdownEndTime - Date.now()
        return Math.max(0, Math.trunc(diffInMs / 1000))
    }

    private constructor(state: TickTenGameState) {
        this.id = state.id
        this.me = state.me
        this.players = state.players
        this.letters = state.letters
        this.categories = state.categories
        this.turn = state.turn
        this.status = state.status
        this.playerSheet = state.playerSheet
        this.leaderboard = state.leaderboard

        this.evaluateCountdown()
    }

    @action
    public update(state: TickTenGameState) {
        this.id = state.id
        this.me = state.me
        this.players = state.players
        this.letters = state.letters
        this.categories = state.categories
        this.turn = state.turn
        this.status = state.status
        this.playerSheet = state.playerSheet
        this.leaderboard = state.leaderboard

        this.evaluateCountdown()
        return this
    }

    @action
    private evaluateCountdown() {
        if (this.status !== GameStatus.COUNTDOWN && this.countdownTimeout) {
            clearTimeout(this.countdownTimeout)
            this.countdownTimeout = undefined
            return
        }

        const now = Date.now()

        if (now >= this.countdownEndTime!) {
            this.status = GameStatus.GRADING
            return
        }

        const diffInMs = this.countdownEndTime! - Date.now()

        if (this.status === GameStatus.COUNTDOWN) {
            this.countdownTimeout = setTimeout(() => {
                this.status = GameStatus.GRADING
            }, diffInMs)
        }
    }

    @action
    public recordAnswer(model: RecordAnswerModel) {
        return tickTenService.recordAnswer(model).subscribe({
            next: (response) => {
                if (response.data) {
                    this.update(response.data)
                    roomState.gateway.play()
                }
            },
        })
    }

    @action
    public submit() {
        return tickTenService.submitAnswers().subscribe({
            next: (response) => {
                if (response.data) {
                    this.update(response.data)
                    roomState.gateway.play()
                }
            },
        })
    }

    @action
    public getSubmissionToGrade() {
        this.submissionToGrade = undefined

        return tickTenService.getSubmissionToGrade().subscribe({
            next: (response) => {
                if (response.data) {
                    this.submissionToGrade = response.data
                }
            },
        })
    }

    @action
    public gradeSubmission(model: GradeSubmissionModel) {
        return tickTenService.gradeSubmission(model).subscribe({
            next: (response) => {
                if (response.data) {
                    this.update(response.data)
                    roomState.gateway.play()
                }
            },
        })
    }

    @action
    public startNextTurn() {
        return tickTenService.startNextTurn().subscribe({
            next: (response) => {
                if (response.data) {
                    this.update(response.data)
                    roomState.gateway.play()
                }
            },
        })
    }

    public static create(state: TickTenGameState) {
        return new TickTenGame(state)
    }
}
