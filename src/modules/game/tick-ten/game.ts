import { action, observable } from 'mobx'
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

export class TickTenGame implements TickTenGameState {
    @observable
    id: string

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

    private constructor(state: TickTenGameState) {
        this.id = state.id
        this.players = state.players
        this.letters = state.letters
        this.categories = state.categories
        this.turn = state.turn
        this.status = state.status
        this.playerSheet = state.playerSheet
        this.leaderboard = state.leaderboard
    }

    @action
    public update(state: TickTenGameState) {
        this.id = state.id
        this.players = state.players
        this.letters = state.letters
        this.categories = state.categories
        this.turn = state.turn
        this.status = state.status
        this.playerSheet = state.playerSheet
        this.leaderboard = state.leaderboard

        return this
    }

    @action
    public recordAnswer(model: RecordAnswerModel) {
        return tickTenService.recordAnswer(model).subscribe({
            next: (response) => {
                if (response.data) {
                    this.update(response.data)
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
                }
            },
        })
    }

    @action
    public getSubmissionToGrade() {
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
                }
            },
        })
    }

    public static create(state: TickTenGameState) {
        return new TickTenGame(state)
    }
}
