import { IsObject, IsString, Length } from 'class-validator'
import { action, observable } from 'mobx'
import { GameConfig } from '../../rooms'
import { Category, Letter, Verdict } from './types'
import { ALL_LETTERS } from '../../../util/misc/string-operations'

export class RecordAnswerModel {
    @IsString()
    @Length(2)
    public category: string

    @IsString()
    @Length(2)
    public answer: string

    constructor(category: string, answer: string) {
        this.category = category
        this.answer = answer
    }
}

export class GradeSubmissionModel {
    @IsString()
    public gradedForId: string

    @IsObject()
    public verdicts: Record<Category, Verdict>

    constructor(gradedForId: string, verdicts: Record<Category, Verdict>) {
        this.gradedForId = gradedForId
        this.verdicts = verdicts
    }

    public get score(): number {
        let total = 0
        for (const verdict of Object.values(this.verdicts)) {
            if (verdict === 'correct') {
                total += 10
            } else if (verdict === 'duplicate') {
                total += 5
            }
        }
        return total
    }
}

export class TickTenGameConfigModel {
    @IsString({ each: true })
    @Length(2, 10, { each: true })
    public categories: Category[]

    public letters: Record<Letter, boolean>

    public countdownInSeconds: number

    constructor({ tickTenGameConfig: { ...config } }: GameConfig) {
        this.categories = [...config.categories]
        this.letters = {}

        ALL_LETTERS.forEach((letter) => {
            this.letters[letter] = config.letters.includes(letter)
        })

        this.countdownInSeconds = config.countdownInSeconds
    }

    public containsLetter(letter: string) {
        return this.letters[letter]
    }

    public toggleLetter(letter: string) {
        this.letters[letter] = !this.containsLetter(letter)
    }

    public get selectedLetters() {
        return Object.entries(this.letters)
            .filter(([_, value]) => value)
            .map(([key]) => key)
    }

    public addCategory(category: Category) {
        const updatedCategories = new Set(this.categories)
        updatedCategories.add(category)
        this.categories = [...updatedCategories]
    }

    public removeCategory(category: Category) {
        const updatedCategories = new Set(this.categories)
        updatedCategories.delete(category)
        this.categories = [...updatedCategories]
    }
}
