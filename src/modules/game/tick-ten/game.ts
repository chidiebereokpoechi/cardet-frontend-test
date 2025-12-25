import { computed, makeAutoObservable, observable, runInAction } from 'mobx'
import {
    Category,
    GamePosition,
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
import {
    getLevenshteinMatchConfidence,
    MatchConfidence,
} from '../../../util/misc/string-operations'
import { sound_manager } from '../../../util'

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

    countdownTimeout?: any

    @observable
    countdownTimeLeftInSeconds?: number

    @computed
    public get isGameOver(): boolean {
        return this.status === GameStatus.GAME_OVER
    }

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
        makeAutoObservable(this)

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

    private handleStateChange(state: TickTenGameState) {
        switch (state.status) {
            case GameStatus.TURN_STARTED:
                if (this.status !== GameStatus.TURN_STARTED) {
                    sound_manager.playStateChange()
                }
                break
            case GameStatus.GRADING:
                if (this.status !== GameStatus.GRADING) {
                    sound_manager.playStateChange()
                }
                break
            default:
                break
        }
    }

    private moveTo(status: GameStatus) {
        this.handleStateChange({ ...this, status })
        this.status = status
    }

    public update(state: TickTenGameState) {
        this.handleStateChange(state)

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

    private evaluateCountdown() {
        if (this.status !== GameStatus.COUNTDOWN && this.countdownTimeout) {
            clearTimeout(this.countdownTimeout)
            this.countdownTimeout = undefined
            return
        }

        const now = Date.now()

        if (now >= this.countdownEndTime!) {
            this.moveTo(GameStatus.GRADING)
            return
        }

        const diffInMs = this.countdownEndTime! - now

        if (this.status === GameStatus.COUNTDOWN) {
            this.countdownTimeout = setTimeout(() => {
                this.moveTo(GameStatus.GRADING)
            }, diffInMs)
        }
    }

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

    public setSubmissionToGrade(submission: SubmissionToGrade | undefined) {
        this.submissionToGrade = submission
    }

    public getSubmissionToGrade() {
        this.setSubmissionToGrade(undefined)

        return tickTenService.getSubmissionToGrade().subscribe({
            next: (response) => {
                if (response.data) {
                    const submissonToGrade = response.data

                    Object.entries(
                        submissonToGrade.submissionToGrade.answers,
                    ).forEach(([category, answer]) => {
                        if (!answer.word || answer.word.length < 2) {
                            answer.verdict = 'incorrect'
                        }

                        submissonToGrade.others.forEach(
                            (otherSubmission) =>
                                (otherSubmission.answers[category].confidence =
                                    getLevenshteinMatchConfidence(
                                        answer.word,
                                        otherSubmission.answers[category].word,
                                    )),
                        )

                        const confidence = submissonToGrade.others.reduce(
                            (acc, otherSubmission) =>
                                Math.max(
                                    acc,
                                    otherSubmission.answers[category]
                                        .confidence!,
                                ),
                            MatchConfidence.LOW,
                        )

                        answer.confidence = confidence

                        const isDuplicateAnswer =
                            [
                                MatchConfidence.EXACT,
                                MatchConfidence.HIGH,
                            ].includes(confidence) && answer.word.length >= 2

                        if (isDuplicateAnswer) {
                            answer.verdict = 'duplicate'
                        }
                    })

                    this.setSubmissionToGrade(response.data)
                }
            },
        })
    }

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

    public getPlayerPosition(playerScore: number): GamePosition {
        const position = [...new Set(Object.values(this.leaderboard))]
            .sort((a, b) => b - a)
            .indexOf(playerScore)

        switch (position) {
            case 0:
                return GamePosition.FIRST
            case 1:
                return GamePosition.SECOND
            case 2:
                return GamePosition.THIRD
            default:
                return GamePosition.OTHER
        }
    }

    public static create(state: TickTenGameState) {
        return new TickTenGame(state)
    }
}
