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
    readonly answers: Record<Category, Answer>
    readonly gradedBy?: Player
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
}

export type Verdict = 'correct' | 'incorrect' | 'duplicate'

export interface Answer {
    readonly word: string
    readonly verdict?: Verdict
}

export interface TickTenGameState {
    readonly id: string
    readonly players: Player[]
    readonly letters: Letter[]
    readonly categories: Category[]
    readonly turn: Turn
    readonly status: GameStatus
    readonly playerSheet: PlayerSheet
    readonly leaderboard: Record<string, number>
}
