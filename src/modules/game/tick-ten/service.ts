import { HttpClient } from '../../../util'
import { SubmissionToGrade, TickTenGameState } from './types'
import { GradeSubmissionModel, RecordAnswerModel } from './models'

class TickTenService {
    public recordAnswer(model: RecordAnswerModel) {
        return HttpClient.post<RecordAnswerModel, TickTenGameState>(
            `tick-ten/record-answer`,
            model,
            false,
        )
    }

    public submitAnswers() {
        return HttpClient.post<never, TickTenGameState>(
            `tick-ten/submit`,
            undefined,
            false,
        )
    }

    public getSubmissionToGrade() {
        return HttpClient.get<SubmissionToGrade>(`tick-ten/submission`)
    }

    public gradeSubmission(model: GradeSubmissionModel) {
        return HttpClient.post<GradeSubmissionModel, TickTenGameState>(
            `tick-ten/grade`,
            model,
            false,
        )
    }
}

export const tickTenService = new TickTenService()
