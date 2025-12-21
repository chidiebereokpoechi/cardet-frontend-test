import { IsObject, IsString, Length } from 'class-validator'
import { Category, Verdict } from './types'

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
    public gradedForId!: string

    @IsObject()
    public verdicts!: Record<Category, Verdict>
}
