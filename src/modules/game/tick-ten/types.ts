import { MatchConfidence } from '../../../util/misc/string-operations'

export interface Player {
    readonly id: string
    readonly name: string
}

export enum GameStatus {
    TURN_STARTED = 'TURN_STARTED',
    COUNTDOWN = 'COUNTDOWN',
    GRADING = 'GRADING',
    LEADERBOARD = 'LEADERBOARD',
    GAME_OVER = 'GAME_OVER',
}

export type Letter = string
export type Category = string

export interface Submission {
    answers: Record<Category, Answer>
    readonly gradedBy?: Player
}

interface PlayerTurnSubmission {
    player: Player
    timestamp: number
}

export interface SubmissionToGrade {
    submissionToGrade: Submission
    player: Player
    others: Submission[]
}

export interface PlayerSheet {
    readonly submissions: Record<Letter, Submission>
}

export interface Turn {
    readonly letter: Letter
    readonly submissions: PlayerTurnSubmission[]
    readonly gradedSubmissions: Player[]
}

export type Verdict = 'correct' | 'incorrect' | 'duplicate'

export interface Answer {
    readonly word: string
    verdict?: Verdict
    confidence?: MatchConfidence
}

export interface TickTenGameConfig {
    readonly categories: Category[]
    readonly letters: Letter[]
    readonly countdownInSeconds: number
}

export interface TickTenGameState {
    readonly id: string
    readonly me: Player
    readonly players: Player[]
    readonly letters: Letter[]
    readonly categories: Category[]
    readonly turn: Turn
    readonly status: GameStatus
    readonly playerSheet: PlayerSheet
    readonly leaderboard: Record<string, number>
}
